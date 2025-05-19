import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/static/Homepage'
import Signup from './pages/User/Signup'
function App() {
 
  return (
    <>
         <Routes>
        <Route path='/' element={<Homepage/>} ></Route>

        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='*'  ></Route>
      </Routes>
      
      
    </>
  )
}

export default App
