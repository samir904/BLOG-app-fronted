import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/static/Homepage'
import Signup from './pages/User/Signup'
import Login from './pages/User/Login'
import Forgotpassword from './pages/User/Forgotpassword'
import Resetpassword from './pages/User/Resetpassword'
import Profile from './pages/User/Profile'
function App() {
 
  return (
    <>
         <Routes>
        <Route path='/' element={<Homepage/>} ></Route>

        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
         <Route path='/forgotpassword' element={<Forgotpassword/>} ></Route>
         <Route path='/reset-password/:resetToken' element={<Resetpassword/>} ></Route>
         <Route path='/profile' element={<Profile/>} ></Route>
        <Route path='*'  ></Route>
      </Routes>
      
      
    </>
  )
}

export default App
