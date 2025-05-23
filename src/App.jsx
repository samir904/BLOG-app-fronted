import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/static/Homepage'
import Signup from './pages/User/Signup'
import Login from './pages/User/Login'
import Forgotpassword from './pages/User/Forgotpassword'
import Resetpassword from './pages/User/Resetpassword'
import Profile from './pages/User/Profile'
import Changepassword from './pages/User/Changepassword'
import Editprofile from './pages/User/Editprofile'
import Createpost from './pages/Post/Createpost'
import Editpost from './pages/Post/Editpost'
import Detailpost from './pages/Post/Detailpost'
function App() {
 
  return (
    <>
         <Routes>
        <Route path='/' element={<Homepage/>} ></Route>

        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        {/*todo-authentication for these route */ }
         <Route path='/forgotpassword' element={<Forgotpassword/>} ></Route>
         <Route path='/reset-password/:resetToken' element={<Resetpassword/>} ></Route>
         <Route path='/profile' element={<Profile/>} ></Route>
         <Route path='/changepassword' element={<Changepassword/>} ></Route>
         <Route path='/user/editprofile' element={<Editprofile/>} ></Route>


        <Route path='/post/create' element={<Createpost/>} ></Route>
        <Route path='/edit-post/:id' element={<Editpost/>} ></Route>
        <Route path='/post/:id' element={<Detailpost/>} ></Route>

        <Route path='*'  ></Route>
      </Routes>
      
      
    </>
  )
}

export default App
