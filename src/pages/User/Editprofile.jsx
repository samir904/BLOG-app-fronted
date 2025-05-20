import React, { useState } from 'react'
import Homelayout from '../../Layouts/Homelayout'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import toastStyles from '../../Helpers/Toaststyle';
import { updateuserprofile } from '../../redux/Slices/AuthSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export default function Editprofile() {
    
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const[previewimage,setpreviewimage]=useState("")
    const[formData,setformData]=useState({
        userName:"",
        avatar:""
    })

    function handleinputchange(e){
        const {name,value}=e.target;
        setformData({
            ...formData,
            [name]:value
        })
    }

     async function handleImage(e){
        e.preventDefault();
        const uploadimage=e.target.files[0];

        setformData({
            ...formData,
            avatar:uploadimage
        })

        const filereader=new FileReader();
        filereader.readAsDataURL(uploadimage)
        filereader.addEventListener("load",async()=>{
            setpreviewimage(filereader.result)
        })


     }

     async function handleformsubmit(e) {
        e.preventDefault();
        if(!formData.userName||!formData.avatar){
            toast.error("All fields are required",toastStyles.error)
            return;
        }
        if(formData.userName.length<5){
            toast.error("Name must be minimum of 5 character ",toastStyles.error)
            return;
        }

        const formres=new FormData();
        formres.append("userName",formData.userName)
        formres.append("avatar",formData.avatar)

        const res=await dispatch(updateuserprofile(formres))
        if(res?.payload?.success){
            toast.success("Profile updated successfully",toastStyles.success)
            navigate("/profile")
            setformData({
                userName:"",
                avatar:""
            })
        }

     }


  return (
    <Homelayout>
        <div className='flex items-center justify-center h-screen ' >
            <form
            onSubmit={handleformsubmit}
            className='flex flex-col text-white shadow-[0_0_10px_purple] gap-2 p-4 py-6 w-96   '
             action="">
                <h1 className='text-center font-semibold text-2xl ' >
                    Edit profile form
                </h1>
                <label htmlFor="avatar">
                {previewimage ? (
                    <img src={previewimage} 
                    className='w-24 h-24 m-auto rounded-full justify-center '
                    />
                ) : (
                    <AccountCircleIcon 
                    className='w-24 h-24 rounded-full m-auto justify-center cursor-pointer '
                       style={{ width: '96px', height: '96px', marginLeft: "120px"}} />
                )}
                </label>
                <input
                 type="file" 
                 className='hidden'
                 id='avatar'
                 name='avatar'
                 
                 onChange={handleImage}
                 accept='.jpg,.jpeg,.png,.svg'
                 />
                 <div className='flex flex-col gap-1 ' >
                    <label 
                    htmlFor="userName"
                    className='font-semibold'
                    >
                        Full name
                    </label>
                    <input 
                    type="text"
                    className='bg-transparent px-2 py-2 border rounded-sm '
                    onChange={handleinputchange}
                    name='userName'
                    value={formData.userName}
                    id='userName'
                     />
                 </div>
                  <button
                         type='submit' 
                         className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full   '
                          >
                            Update profile
                         </button>
             </form>
        </div>
    </Homelayout>
  )
}
