import { Minus, Square, X } from 'lucide-react'

const Header = () => {
  return (
    <header className='bg-zinc-800 flex '>
        <div className='flex-1 relative drag after:absolute after:block after:h-full after:w-full  '>
             
        </div>
        <div className='flex justify-end text-zinc-100'>
            <button onClick={()=> window.electron.ipcRenderer.send("minimize")} className='p-[1rem] hover:bg-zinc-700 duration-200'>
                <Minus className='size-[2rem]'/>
            </button>
            <button onClick={()=> window.electron.ipcRenderer.send("toggleMaximize")} className='p-[1rem] hover:bg-zinc-700 duration-200'>
                <Square className='size-[1.8rem] '/>
            </button>
            <button onClick={()=> window.electron.ipcRenderer.send("close")} className='p-[1rem] hover:bg-rose-700 duration-200'>
                <X className='size-[2rem]'/>
            </button>
        </div>
    </header>
  )
}

export default Header