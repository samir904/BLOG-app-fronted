import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className='bg-yellow-500 text-black' >
          hello world
        </h1>
      </div>
    </>
  )
}

export default App
