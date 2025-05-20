import React, { useState } from 'react'
import Homelayout from '../../Layouts/Homelayout'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import toastStyles from '../../Helpers/Toaststyle';
import { resetpassword } from '../../redux/Slices/AuthSlice';
import { isValidPassword } from '../../Helpers/regexMatch';

export default function Resetpassword() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const{resetToken}=useParams();//extract reset token 

    const[formdata,setformdata]=useState({
        password:"",
        confirmPassword:""
    })

    function handleInputChange(e){
        const{name,value}=e.target;
        setformdata({
            ...formdata,
            [name]:value
        })
    }

async    function handleformsubmit(e){
        e.preventDefault();
        if(!isValidPassword(formdata.password)){
            toast.error("password must have uppercase loercase and a special character and 8 character long",toastStyles.error)
        }
        if(!formdata.password||!formdata.confirmPassword){
            toast.error("All fields are required",toastStyles.error)
            return;
        }
        if(formdata.password!==formdata.confirmPassword){
            toast.error("Passwords do not match",toastStyles.error)
            return;
        }

        const res=await dispatch(resetpassword({
                resetToken,
                password:formdata.password
        }))
        if(res?.payload?.success){
            toast.success('Password reset successfully', toastStyles.success);
            navigate("/login")
            setformdata({
                password:"",
                confirmPassword:""
            })
        }
    }



  return (
    <Homelayout>
        <div className='flex items-center justify-center h-screen ' >
            <form 
            onSubmit={handleformsubmit}
            noValidate
            className='shadow-[0_0_10px_black] flex flex-col gap-2 p-4 rounded-md text-white w-96 py-6 '
            >
                <h1
                 className='text-center text-2xl font-semibold '
                  >
                    Reset password form
                </h1>
                <div
                 className='flex flex-col gap-2  ' >
                    <label
                     htmlFor="password"
                     className='font-semibold  '>
                       New Password
                    </label>
                    <input
                    required
                     type="password"
                     className='bg-transparent py-2 px-2 border rounded-sm '
                     placeholder='Enter your new  password..'
                     onChange={handleInputChange}
                     name='password'
                     value={formdata.password}
                      />
                </div>
                <div className='flex flex-col gap-2' >
                    <label 
                    htmlFor="confirmPassword"
                    className='font-semibold'
                    >
                        Confirm password
                    </label>
                    <input
                    required
                     type="password"
                     onChange={handleInputChange}
                        name='confirmPassword'
                        value={formdata.confirmPassword}
                        className='bg-transparent py-2 px-2 border rounded-sm '
                        placeholder='Confirm your password'
                     />
                </div>
                <button
                type='submit'
                 className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full' >
                    Submit
                </button>


            </form>
        </div>
    </Homelayout>
  )
}
