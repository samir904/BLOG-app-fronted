import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import toastStyles from '../../Helpers/Toaststyle';
import { createAccount } from '../../redux/Slices/AuthSlice';
import Homelayout from '../../Layouts/Homelayout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { isEmail, isValidPassword } from '../../Helpers/regexMatch';
export default function Signup() {
    const usedispatch = useDispatch();
    const usenavigate = useNavigate();

    const [previewimage, setpreviewimage] = useState("");

    const [signupdata, setsignupdata] =useState ({
        userName: "",
        email: "",
        password: "",
        avatar: ""
    })

    function handleuserinput(e) {
        const { name, value } = e.target;
        setsignupdata({
            ...signupdata,
            [name]: value
        })
    }

    function handleimage(e) {
        e.preventDefault();
        const uploadimage = e.target.files[0];
        if (!uploadimage) {
            toast.error("Please upload profile image ", toastStyles.error)
            return;
        }
        if (uploadimage) {
            setsignupdata({
                ...signupdata,
                avatar: uploadimage
            })
        }


        const filereader = new FileReader();
        filereader.readAsDataURL(uploadimage);
        filereader.addEventListener("load", function () {
            setpreviewimage(this.result)
        })
    }

async    function submitsignupform(e) {
        e.preventDefault();
        if (!signupdata.email || !signupdata.password || !signupdata.userName || !signupdata.avatar) {
            toast.error("All fields are required", toastStyles.error)
            return;
        }
        //todo email validation
        if(!isEmail(signupdata.email)){
            toast.error("Invalid email id ")
            return;
        }
        if(!isValidPassword(signupdata.password)){
            toast.error("Your password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character",toastStyles.error)
            return;
        }
        if(signupdata.userName.length<5){
            toast.error("Name should be atleast 5 character",toastStyles.error)
            return;
        }
        //todo password validation

        const formdata = new FormData();
        formdata.append("userName", signupdata.userName)
        formdata.append("email", signupdata.email)
        formdata.append("avatar", signupdata.avatar)
        formdata.append("password", signupdata.password)

        const res =await usedispatch(createAccount(formdata))
        console.log(res)
        if (res?.payload?.success) {
            usenavigate("/")
            setpreviewimage("")
            setsignupdata({
                userName: "",
                email: "",
                password: "",
                avatar: ""
            })
        }

    }
    return (
        <Homelayout>
            <div className='flex items-center justify-center h-[90vh] ' >
                <form
                onSubmit={submitsignupform}
                noValidate
                 className='flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]  ' 
                 >
                    <h1 className='text-center text-2xl font-semibold ' >
                        Registration page
                    </h1>
                   <label 
                   htmlFor="avatar">
                    {previewimage?(
                        <img className='w-24 h-24 rounded-full m-auto justify-center ' src={previewimage} alt="profile photo" />
                    ):(
                      <AccountCircleIcon
                       className='w-24 h-24 rounded-full m-auto justify-center cursor-pointer '
                       style={{ width: '96px', height: '96px', marginLeft: "120px" }} 
                       />  
                    )}
                   </label>
                   <input
                    type="file"
                    onChange={handleimage}
                    id='avatar'
                    className='hidden  '
                    accept='.jpg,.jpeg,.png,.svg'
                    name='avatar'
                     />
                     <div className='flex flex-col gap-1 ' >
                        <label
                        className='font-semibold'

                         htmlFor="userName">Full Name</label>
                         <input 
                         type="text" 
                         className='bg-transparent px-2 py-2 border '
                         name='userName'
                         placeholder='Enter your name..'
                         required
                         id='userName'
                         value={signupdata.userName}
                         onChange={handleuserinput}
                         />
                     </div>
                      <div className='flex flex-col gap-1 ' >
                        <label
                        className='font-semibold'

                         htmlFor="email">Email</label>
                         <input 
                         type="email" 
                         className='bg-transparent px-2 py-2 border '
                         name='email'
                         placeholder='Enter your email..'
                         required
                         id='email'
                         value={signupdata.email}
                         onChange={handleuserinput}
                         />
                     </div>
                      <div className='flex flex-col gap-1 ' >
                        <label
                        className='font-semibold'

                         htmlFor="password">Password</label>
                         <input 
                         type="password" 
                         className='bg-transparent px-2 py-2 border '
                         name='password'
                         placeholder='Enter the password..'
                         required
                         id='password'
                         value={signupdata.password}
                         onChange={handleuserinput}
                         />

                         <button
                         type='submit' 
                         className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full   '
                          >
                            Create account
                         </button>
                         <p className='text-center pt-1 ' >
                            Already have an account ? <Link to="/login" className='link text-accent cursor-pointer ' >Login</Link>
                         </p>
                     </div>

                </form>
            </div>
       </Homelayout>
    )
}
