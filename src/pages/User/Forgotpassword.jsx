import React, { useState } from 'react'
import Homelayout from '../../Layouts/Homelayout'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import toastStyles from '../../Helpers/Toaststyle';
import { isEmail } from '../../Helpers/regexMatch';
import { forgotpassword } from '../../redux/Slices/AuthSlice';

export default function Forgotpassword() {
    
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [formdata,setformdata]=useState({
        email:""
    })

    function handleinputchange(e){
        const{name,value}=e.target;
        setformdata({
            ...formdata,
            [name]:value
        })
    }

  async  function handlefromsubmit(e){
        e.preventDefault();
        if(!formdata.email){
            toast.error("Email is required",toastStyles.error)
            return;
        }
        if(!isEmail(formdata.email)){
            toast.error("Please provide a valid email id",toastStyles.error)
            return;
        }

        const res=await dispatch(forgotpassword(formdata));
        if(res?.payload?.success){
            navigate("/resetpassword");
            setformdata({
                email:""
            })
        }
    }
  
  
    return (
    <Homelayout>
        <div className='flex items-center justify-center h-screen ' >
            <form 
            onSubmit={handlefromsubmit}
            noValidate
            className='flex rounded-md flex-col gap-2 p-4 shadow-[0_0_10px_black] text-white w-96 py-6  '
            >
                <h1 className='text-center text-2xl font-bold ' >
                    Forgot password form
                </h1>
                <div className='flex flex-col gap-2 ' >
                    <label
                    className='font-semibold'
                     htmlFor="email">
                        Email
                     </label>
                     <input 
                     onChange={handleinputchange}
                     id='email'
                     name='email'
                     value={formdata.email}
                     type="text"
                     className='bg-transparent border py-2  rounded-sm  '
                      />
                </div>
                <button
                         type='submit' 
                         className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full   '
                          >
                            Submit
                         </button>
            </form>
        </div>
    </Homelayout>
  )
}
