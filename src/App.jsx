import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/static/Homepage'
function App() {
 
  return (
    <>
         <Routes>
        <Route path='/' element={<Homepage/>} ></Route>
      </Routes>
      
      
    </>
  )
}

export default App
