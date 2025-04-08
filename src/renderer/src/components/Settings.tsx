import { Clock } from 'lucide-react'
import React, { SetStateAction, useEffect, } from 'react'
import * as Switch from '@radix-ui/react-switch'
interface PomodoroTime {
  focus: string
  shortRest: string
  longRest: string
}

const Settings = ({
  initialTime,
  setInitialTime,
  autoStartFocus,
  autoStartRest,
  setAutoStartFocus,
  setAutoStartRest
}: {
  initialTime: PomodoroTime
  setInitialTime: React.Dispatch<SetStateAction<PomodoroTime>>,
  autoStartFocus: boolean,
  setAutoStartFocus: React.Dispatch<SetStateAction<boolean>>,
  autoStartRest: boolean,
  setAutoStartRest: React.Dispatch<SetStateAction<boolean>>,
}) => {
  useEffect(()=> {
    localStorage.setItem("initialTime", JSON.stringify(initialTime))
  },[initialTime])
  useEffect(()=> {
    localStorage.setItem("autoStartFocus", JSON.stringify(autoStartFocus))
  }, [autoStartFocus])
  useEffect(()=> {
    localStorage.setItem("autoStartRest", JSON.stringify(autoStartRest))
  }, [autoStartRest])
  return (
    <div className="mt-[2rem] ">
      <div className="text-zinc-100 flex gap-[.6rem] items-center text-[1.8rem] font-medium">
        <Clock className="size-[2rem] stroke-3" />
        <span>Relógio</span>
      </div>
      <div className="mt-[1.2rem]">
        <span className="text-zinc-300 text-[1.6rem]">Tempo inicial</span>
        <div className="inputs-time">
          <input
            type="number"
            value={initialTime.focus.split(':')[0]}
            onChange={({ target: { value } }) =>
              setInitialTime((v) => ({ ...v, focus: value + ':00' }))
            }
          />
          <input
            type="number"
            value={initialTime.shortRest.split(':')[0]}
            onChange={({ target: { value } }) =>
              setInitialTime((v) => ({ ...v, shortRest: value + ':00' }))
            }
          />
          <input
            type="number"
            value={initialTime.longRest.split(':')[0]}
            onChange={({ target: { value } }) =>
              setInitialTime((v) => ({ ...v, longRest: value + ':00' }))
            }
          />
        </div>
      </div>
      <div className="mt-[2rem]">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 text-[1.6rem]">Começar pomodoro automaticamente</span>
          <Switch.Root
            checked={autoStartFocus}
            onCheckedChange={() => setAutoStartFocus((v) => !v)}
            className="w-[6rem] group h-[30px] rounded-full bg-zinc-700 px-[.4rem] data-[state=checked]:bg-zinc-100"
          >
            <Switch.Thumb className="block bg-zinc-900 size-[2.2rem] rounded-full data-[state=checked]:translate-x-[3rem] duration-300" />
          </Switch.Root>
        </div>
      </div>
      <div className="mt-[2rem]">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 text-[1.6rem]">Começar pausas automaticamente</span>
          <Switch.Root
            checked={autoStartRest}
            onCheckedChange={() => setAutoStartRest((v) => !v)}
            className="w-[6rem] group h-[30px] rounded-full bg-zinc-700 px-[.4rem] data-[state=checked]:bg-zinc-100"
          >
            <Switch.Thumb className="block bg-zinc-900 size-[2.2rem] rounded-full data-[state=checked]:translate-x-[3rem] duration-300" />
          </Switch.Root>
        </div>
      </div>
    </div>
  )
}

export default Settings
