import { useEffect, useRef, useState } from "react";
import Settings from "./components/Settings";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import clsx from "clsx";
import { ActiveMode, LocalConfig, NotificationsActions, PomodoroActions } from "./types/general";

function App(): JSX.Element {
  const ipcHandle = (value: NotificationsActions): void =>
    window.electron.ipcRenderer.send(value);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  // const [confirmUpdate, setConfirmUpdate] = useState(false)
  // const [newVersion, setNewVersion] = useState<null | string>(null)

  useEffect(() => {
    const listener = (): void => {
      setUpdateAvailable(true);
    };

    window.electron.ipcRenderer.on("update-downloaded", listener);

    return (): void => {
      window.electron.ipcRenderer.removeListener("update-downloaded", listener);
    };
  }, []);



  const [activeMode, setActiveMode] = useState<ActiveMode>("focus");
  const [localConfig, setLocalConfig] = useState<LocalConfig>(() => {
    const localConfig = localStorage.getItem("localConfig");
    return localConfig
      ? JSON.parse(localConfig)
      : {
        focus: "20:00",
        longRest: "10:00",
        shortRest: "05:00",
        cicles: 4,
        pallete: "midnight",
        initalTimeConfig: { autoStartFocus: false, autoStartRest: false },
      };
  });

  const [pomodoroTime, setPomodoroTime] = useState({
    focus: localConfig.focus,
    shortRest: localConfig.shortRest,
    longRest: localConfig.longRest,
  });
  const [pomodoroActions, setPomodoroActions] = useState<PomodoroActions>({
    focus: "pause",
    longRest: "pause",
    shortRest: "pause",
  });

  useEffect(() => {
    setPomodoroTime({
      focus: localConfig.focus,
      shortRest: localConfig.shortRest,
      longRest: localConfig.longRest,
    });
  }, [localConfig]);
  const [cicles, setCicles] = useState(0);

  const interval = useRef<NodeJS.Timeout | null>(null);
  function handleTime(v: string, pomoTime: keyof typeof pomodoroTime): string {
    const [minutes, seconds] = v.split(":").map(Number);

    if (v === "00:00") {
      clearInterval(interval.current as NodeJS.Timeout);
      if (pomoTime === "focus") {
        setActiveMode("shortRest");
        if (!localConfig.initalTimeConfig.autoStartRest) {
          clearInterval(interval.current as NodeJS.Timeout);
          setPomodoroActions((v) => ({ ...v, focus: "pause" }));
        }
        ipcHandle("focus-end");
        return localConfig.focus;
      } else if (pomoTime === "shortRest") {
        if (!localConfig.initalTimeConfig.autoStartFocus) {
          clearInterval(interval.current as NodeJS.Timeout);
          setPomodoroActions((v) => ({ ...v, focus: "pause" }));
        }
        setCicles((v) => v + 1);
        if (cicles > 0 && cicles % localConfig.cicles === 0) {
          setActiveMode("longRest");
          ipcHandle("long-rest-start");
        } else {
          setActiveMode("focus");
          ipcHandle("short-rest-end");
        }
        return localConfig.shortRest;
      } else {
        setActiveMode("focus");
        ipcHandle("long-rest-end");
        return localConfig.longRest;
      }
    }

    if (seconds === 0) {
      if (minutes === 0) {
        return "00:00";
      }

      return `${String(minutes - 1).padStart(2, "0")}:59`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds - 1).padStart(2, "0")}`;
  }

  useEffect(() => {
    if (pomodoroActions.focus === "pause") {
      clearInterval(interval.current as NodeJS.Timeout);
    } else {
      if (activeMode === "focus") {
        interval.current = setInterval(() => {
          setPomodoroTime((v) => {
            return {
              ...v,
              focus: handleTime(v.focus, "focus"),
            };
          });
        }, 1000);
      } else if (activeMode === "shortRest") {
        interval.current = setInterval(() => {
          setPomodoroTime((v) => {
            return {
              ...v,
              shortRest: handleTime(v.shortRest, "shortRest"),
            };
          });
        }, 1000);
      } else if (activeMode === "longRest") {
        interval.current = setInterval(() => {
          setPomodoroTime((v) => {
            return {
              ...v,
              longRest: handleTime(v.longRest, "longRest"),
            };
          });
        }, 1000);
      } else {
        clearInterval(interval.current as NodeJS.Timeout);
        setPomodoroActions({
          focus: "pause",
          longRest: "pause",
          shortRest: "pause",
        });
      }
    }
  }, [pomodoroActions, activeMode]);

  useEffect(() => {
    if (localConfig.pallete) {
      document.body.setAttribute("data-pallete", localConfig.pallete);
    }
  }, [localConfig.pallete]);

  useEffect(() => {
    const startPomodoro = (): void => {
      setPomodoroTime({
        focus: localConfig.focus,
        shortRest: localConfig.shortRest,
        longRest: localConfig.longRest,
      })
      clearInterval(interval.current as NodeJS.Timeout)
      setActiveMode('focus')
      setPomodoroActions({
        focus: 'running',
        longRest: 'pause',
        shortRest: 'pause'
      })
    }
    window.electron.ipcRenderer.on('start-pomodoro', startPomodoro)

    const stopPomodoro = () => {
      clearInterval(interval.current as NodeJS.Timeout)
      setPomodoroActions({
        focus: 'pause',
        longRest: 'pause',
        shortRest: 'pause'
      })
    }
    window.electron.ipcRenderer.on('stop-pomodoro', stopPomodoro)
    const startRest = () => {
      setPomodoroTime({
        focus: localConfig.focus,
        shortRest: localConfig.shortRest,
        longRest: localConfig.longRest,
      })
      clearInterval(interval.current as NodeJS.Timeout)
      setActiveMode('shortRest')
      setPomodoroActions({
        focus: 'running',
        longRest: 'pause',
        shortRest: 'pause'
      })
    }
    window.electron.ipcRenderer.on('start-rest', startRest)
    const stopRest = () => {
      clearInterval(interval.current as NodeJS.Timeout)
      setPomodoroActions({
        focus: 'pause',
        longRest: 'pause',
        shortRest: 'pause'
      })
    }
    window.electron.ipcRenderer.on('stop-rest', stopRest)
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners("start-pomodoro")
      window.electron.ipcRenderer.removeAllListeners("stop-pomodoro")
      window.electron.ipcRenderer.removeAllListeners("start-rest")
      window.electron.ipcRenderer.removeAllListeners("stop-rest")
    }
  }, [localConfig])

  return (
    <>
      <Header />
      <main>
        <div
          className={clsx("min-w-[36dvw]  mx-auto", {
            "max-w-max": activeMode !== "settings",
            "max-w-min": activeMode === "settings",
          })}
        >
          <div
            className={clsx(
              "flex items-center justify-center action-buttons p-[1rem]  rounded-[1rem] mt-[4rem] gap-[.5rem] mx-auto",
              {
                "bg-zinc-800/60": localConfig.pallete === "midnight",
                "bg-capuccino-800/70": localConfig.pallete === "capuccino",
                "bg-rose-800/70": localConfig.pallete === "red",
              }
            )}
          >
            <button
              data-active={activeMode === "focus"}
              onClick={() => {
                setActiveMode("focus");
                clearInterval(interval.current as NodeJS.Timeout);
                setPomodoroActions((v) => ({
                  ...v,
                  focus: "pause",
                }));
              }}
            >
              Pomodoro
            </button>
            <button
              data-active={activeMode === "shortRest"}
              onClick={() => {
                setActiveMode("shortRest");
                clearInterval(interval.current as NodeJS.Timeout);
                setPomodoroActions((v) => ({
                  ...v,
                  focus: "pause",
                }));
              }}
            >
              Descanso rápido
            </button>
            <button
              data-active={activeMode === "longRest"}
              onClick={() => {
                setActiveMode("longRest");
                clearInterval(interval.current as NodeJS.Timeout);
                setPomodoroActions((v) => ({
                  ...v,
                  focus: "pause",
                }));
              }}
            >
              Descanso longo
            </button>
            <button
              onClick={() => {
                setActiveMode("settings");
                clearInterval(interval.current as NodeJS.Timeout);
                setPomodoroActions((v) => ({
                  ...v,
                  focus: "pause",
                }));
              }}
              data-active={activeMode === "settings"}
            >
              Configurações
            </button>
          </div>
          {activeMode !== "settings" && (
            <>
              <h1
                className={clsx(
                  " text-[12rem] text-center mt-[4rem] font-semibold",
                  {
                    "text-zinc-100": localConfig.pallete === "midnight",
                    "text-capuccino-900": localConfig.pallete === "capuccino",
                    "text-rose-900": localConfig.pallete === "red",
                  }
                )}
              >
                {pomodoroTime[activeMode]}
              </h1>
              <button
                onClick={() =>
                  setPomodoroActions((v) => ({
                    ...v,
                    focus: v.focus === "pause" ? "running" : "pause",
                  }))
                }
                className={clsx(
                  "text-[2rem] p-[1rem] mx-auto rounded-[1rem] block mt-[2rem] font-semibold",
                  {
                    "bg-zinc-100 text-zinc-900 ":
                      localConfig.pallete === "midnight",
                    "bg-capuccino-900 text-capuccino-100 ":
                      localConfig.pallete === "capuccino",
                    "bg-rose-900 text-rose-100 ":
                      localConfig.pallete === "red",
                  }
                )}
              >
                {pomodoroActions.focus === "pause" ? "Iniciar" : "Pausar"}
              </button>
            </>
          )}
          {activeMode === "settings" && (
            <Settings
              localConfig={localConfig}
              setLocalConfig={setLocalConfig}
            />
          )}
        </div>
      </main>
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ scale: 0.7, bottom: "-8rem", opacity: 0 }}
            exit={{ scale: 0.7, bottom: "-8rem", opacity: 0 }}
            animate={{ scale: 1, bottom: "4rem", opacity: 1 }}
            className={clsx("fixed right-[4rem] p-[1.4rem] rounded-[1rem] border  w-[30rem]", {
              "bg-zinc-800  border-zinc-600": localConfig.pallete === "midnight",
              "bg-capuccino-900  border-capuccino-600": localConfig.pallete === "capuccino",
              "bg-rose-800  border-rose-600": localConfig.pallete === "red",
            })}
          >
            <p className={clsx(" text-[1.3rem] max-w-[80%] leading-[1.3]", {
              "text-zinc-100": localConfig.pallete === "midnight",
              "text-capuccino-100": localConfig.pallete === "capuccino",
              "text-rose-100": localConfig.pallete === "red",
            })}>
              Uma nova versão está disponível para download, deseja atualiza
              agora?
            </p>
            <div className="flex items-center gap-[1rem]">
              <button
                onClick={() =>
                  window.electron.ipcRenderer.send("confirm-update")
                }
                className={clsx(" p-[.8rem] rounded-[1rem] text-[1.2rem] block mt-[1.2rem]", {
                  "bg-zinc-100 text-zinc-900": localConfig.pallete === "midnight",
                  "bg-capuccino-100 text-capuccino-900": localConfig.pallete === "capuccino",
                  "bg-rose-100 text-rose-900": localConfig.pallete === "red",
                })}
              >
                Atualizar agora
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className={clsx(" p-[.8rem] rounded-[1rem] text-[1.2rem] block mt-[1.2rem]", {
                  "bg-zinc-700 text-zinc-100": localConfig.pallete === "midnight",
                  "bg-capuccino-800/50 text-capuccino-200": localConfig.pallete === "capuccino",
                  "bg-rose-600/50 text-rose-200": localConfig.pallete === "red",
                })}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
