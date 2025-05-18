import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/static/Homepage'
import Footer from './Components/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <Routes>
        <Route path='/' element={<Footer/>} ></Route>
      </Routes>
      
    </>
  )
}

export default App
