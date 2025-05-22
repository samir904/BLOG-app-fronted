import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toastStyles from '../../Helpers/Toaststyle';
import { isEmail } from '../../Helpers/regexMatch';
import { login } from '../../redux/Slices/AuthSlice';
import Homelayout from '../../Layouts/Homelayout';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logindata, setlogindata] = useState({
        email: "",
        password: ""
    })

    function handleInputChange(e) {
        const { name, value } = e.target;
        setlogindata({
            ...logindata,
            [name]: value
        })
    }

   async function handleloginformsubmit(e) {
        e.preventDefault();
        if (!logindata.email || !logindata.password) {
            toast.error("All fields are required", toastStyles.error)
            return;
        }
        if (!isEmail(logindata.email)) {
            toast.error("Email id is not valid", toastStyles.error);
            return;
        }
        

        const res = await dispatch(login(logindata))//here pass login data to but why we can.t pass form data as i have passed the form data while cereating the account grok can you tell me 
        if (res?.payload?.success) {
            navigate("/")
            setlogindata({
                email: "",
                password: ""
            })
        }
    }

    return (
       <Homelayout>
        <div className='flex items-center justify-center h-screen ' >
            <form
            noValidate
            onSubmit={handleloginformsubmit}
            className='flex rounded-md flex-col gap-2 shadow-[0_0_10px_purple] p-4 w-96 '
            >
                <h1 className='font-bold text-2xl text-white text-center ' >
                    Login form
                </h1>
                <div className='flex flex-col gap-1 ' >
                        <label
                        className='font-semibold'

                         htmlFor="email">Email</label>
                         <input 
                         type="email" 
                         className='bg-transparent px-2 py-2 border rounded-sm '
                         name='email'
                         placeholder='Enter your email..'
                         required
                         id='email'
                         value={logindata.email}
                         onChange={handleInputChange}
                         />
                     </div>
                     <div className='flex flex-col gap-1 ' >
                        <label
                        className='font-semibold'

                         htmlFor="password">Password</label>
                         <input 
                         type="password" 
                         className='bg-transparent px-2 py-2 rounded-sm border '
                         name='password'
                         placeholder='Enter your password..'
                         required
                         id='password'
                         value={logindata.password}
                         onChange={handleInputChange}
                         />
                     </div>
                     <button
                         type='submit' 
                         className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full   '
                          >
                            Login
                         </button>
                         <p className='text-center pt-1 ' >
                            Dont't have an account ? <Link to="/signup" className='link text-accent cursor-pointer ' >Signup</Link>
                         </p>
                         <p className='text-center pt-1 ' >
                             <Link to="/forgotpassword" className='link text-accent cursor-pointer ' >forgot password?</Link>
                         </p>
                         
            </form>

        </div>
       </Homelayout>
    )
}
