import { Clock } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";
import { LocalConfig } from "@renderer/types/general";
import clsx from "clsx";

const colors: LocalConfig["pallete"][] = [
  "capuccino",
  "red",
  "midnight",
];

const Settings = ({
  localConfig,
  setLocalConfig,
}: {
  localConfig: LocalConfig;
  setLocalConfig: Dispatch<SetStateAction<LocalConfig>>;
}) => {
  useEffect(() => {
    localStorage.setItem("localConfig", JSON.stringify(localConfig));
  }, [localConfig]);
  return (
    <div className="mt-[2rem] ">
      <div
        className={clsx(
          " flex gap-[.6rem] items-center text-[1.8rem] font-medium",
          {
            "text-zinc-100": localConfig.pallete === "midnight",
            "text-rose-900": localConfig.pallete === "red",
            "text-capuccino-900": localConfig.pallete === "capuccino",
          }
        )}
      >
        <Clock className="size-[2rem] stroke-3" />
        <span>Relógio</span>
      </div>
      <div className="mt-[1.2rem]">
        <span
          className={clsx(" text-[1.6rem]", {
            "text-zinc-300": localConfig.pallete === "midnight",
            "text-capuccino-900": localConfig.pallete === "capuccino",
            "text-rose-900": localConfig.pallete === "red",
          })}
        >
          Tempo inicial
        </span>
        <div className="inputs-time">
          <input
            type="number"
            value={localConfig.focus.split(":")[0]}
            onChange={({ target: { value } }) => {
              if (+value <= 0) return;
              setLocalConfig((v) => ({ ...v, focus: value + ":00" }));
            }}
          />
          <input
            type="number"
            value={localConfig.shortRest.split(":")[0]}
            onChange={({ target: { value } }) => {
              if (+value <= 0) return;
              setLocalConfig((v) => ({ ...v, shortRest: value + ":00" }));
            }}
          />
          <input
            type="number"
            value={localConfig.longRest.split(":")[0]}
            onChange={({ target: { value } }) => {
              if (+value <= 0) return;
              setLocalConfig((v) => ({ ...v, longRest: value + ":00" }));
            }}
          />
        </div>
      </div>
      <div className="mt-[2rem]">
        <div className="flex items-center justify-between">
          <span
            className={clsx(" text-[1.6rem] flex-[1_1_80%]", {
              "text-zinc-300": localConfig.pallete === "midnight",
              "text-capuccino-900": localConfig.pallete === "capuccino",
              "text-rose-900": localConfig.pallete === "red",
            })}
          >
            Começar pomodoro automaticamente
          </span>
          <Switch.Root
            checked={localConfig.initalTimeConfig.autoStartFocus}
            onCheckedChange={() =>
              setLocalConfig((v) => ({
                ...v,
                initalTimeConfig: {
                  ...v.initalTimeConfig,
                  autoStartFocus: !v.initalTimeConfig.autoStartFocus,
                },
              }))
            }
            className={clsx(
              "w-[6rem] group h-[30px] rounded-full px-[.4rem] ",
              {
                "bg-zinc-700 data-[state=checked]:bg-zinc-100":
                  localConfig.pallete === "midnight",
                "bg-rose-300 data-[state=checked]:bg-rose-800":
                  localConfig.pallete === "red",
                "bg-capuccino-300 data-[state=checked]:bg-capuccino-800":
                  localConfig.pallete === "capuccino",
              }
            )}
          >
            <Switch.Thumb
              className={clsx(
                "block size-[2.2rem] rounded-full data-[state=checked]:translate-x-[3rem] duration-300",
                {
                  "bg-zinc-900 ": localConfig.pallete === "midnight",
                  "bg-rose-700 data-[state=checked]:bg-red-300": localConfig.pallete === "red",
                  "bg-capuccino-900 data-[state=checked]:bg-capuccino-300": localConfig.pallete === "capuccino",
                }
              )}
            />
          </Switch.Root>
        </div>
      </div>
      <div className="mt-[2rem]">
        <div className="flex items-center justify-between">
          <span
            className={clsx(" text-[1.6rem] flex-[1_1_80%]", {
              "text-zinc-300": localConfig.pallete === "midnight",
              "text-capuccino-900": localConfig.pallete === "capuccino",
              "text-rose-900": localConfig.pallete === "red",
            })}
          >
            Começar pausas automaticamente
          </span>
          <Switch.Root
            checked={localConfig.initalTimeConfig.autoStartRest}
            onCheckedChange={() => {
              setLocalConfig((v) => ({
                ...v,
                initalTimeConfig: {
                  ...v.initalTimeConfig,
                  autoStartRest: !v.initalTimeConfig.autoStartRest,
                },
              }));
            }}
            className={clsx(
              "w-[6rem] group h-[30px] rounded-full px-[.4rem] ",
              {
                "bg-zinc-700 data-[state=checked]:bg-zinc-100":
                  localConfig.pallete === "midnight",
                "bg-rose-300 data-[state=checked]:bg-rose-800":
                  localConfig.pallete === "red",
                "bg-capuccino-300 data-[state=checked]:bg-capuccino-800":
                  localConfig.pallete === "capuccino",
              }
            )}
          >
            <Switch.Thumb
              className={clsx(
                "block size-[2.2rem] rounded-full data-[state=checked]:translate-x-[3rem] duration-300",
                {
                  "bg-zinc-900 ": localConfig.pallete === "midnight",
                  "bg-rose-700 data-[state=checked]:bg-red-300": localConfig.pallete === "red",
                  "bg-capuccino-900 data-[state=checked]:bg-capuccino-300": localConfig.pallete === "capuccino",
                }
              )}
            />
          </Switch.Root>
        </div>
      </div>
      <div className="mt-[1.2rem] flex items-center justify-between">
        <span
          className={clsx(" text-[1.6rem] flex-[1_1_80%]", {
            "text-zinc-300": localConfig.pallete === "midnight",
            "text-capuccino-900": localConfig.pallete === "capuccino",
            "text-rose-900": localConfig.pallete === "red",
          })}
        >
          Quantidade de ciclos
        </span>
        <input
          type="number"
          className={clsx("input-style flex-[1_1_20%]", {
            "bg-zinc-800 text-zinc-50":localConfig.pallete === "midnight",
            "bg-rose-800/70 text-rose-50":localConfig.pallete === "red",
            "bg-capuccino-900/70 text-capuccino-50":localConfig.pallete === "capuccino",
          })}
          value={localConfig.cicles}
          onChange={({ target: { value } }) =>
            setLocalConfig((v) => ({ ...v, cicles: +value }))
          }
        />
      </div>
      <div className="mt-[1.2rem] flex items-center justify-between">
        <span
          className={clsx(" text-[1.6rem] flex-[1_1_80%]", {
            "text-zinc-300": localConfig.pallete === "midnight",
            "text-capuccino-900": localConfig.pallete === "capuccino",
            "text-rose-900": localConfig.pallete === "red",
          })}
        >
          Paleta de cores
        </span>
        <div className="flex gap-[1rem]">
          {colors.map((c) => (
            <label
              key={c}
              data-selected={localConfig.pallete === c}
              className={clsx(
                "size-[3rem]  duration-200 border border-zinc-300 shadow rounded-full ",
                {
                  "bg-zinc-900": c === "midnight",
                  "bg-rose-700": c === "red",
                  "bg-capuccino-700": c === "capuccino",
                }
              )}
            >
              <input
                type="radio"
                value={c}
                checked={localConfig.pallete === c}
                hidden
                onChange={({ target: { value } }) =>
                  setLocalConfig((v) => ({ ...v, pallete: value as typeof c }))
                }
                name="color"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
