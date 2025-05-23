import React, { useEffect } from 'react'
import Homelayout from '../../Layouts/Homelayout'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { getprofile } from '../../redux/Slices/AuthSlice';

export default function Profile() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const userdata=useSelector((state)=>state?.auth?.data);


    useEffect(()=>{
        async function fetchUserData(params) {
           const res= await dispatch(getprofile());
            console.log("this state useselector",userdata)
            console.log("this is dispatch response",res);
        }
        fetchUserData();
    },[])
  return (
    <Homelayout>
        <div className='min-h-[90vh] flex items-center justify-center ' >
            <div className='my-10 flex flex-col gap-4 rounded-lg p-4 text-white shadow-[0_0_10px_purple] w-96 ' >
                <img 
                src={userdata?.avatar?.secure_url}
                 alt="profile photo"
                 className='w-40 m-auto rounded-full border border-purple-500 '
                 />
                 <h3 className='text-2xl  text-center font-semibold capitalize  ' >
                    {userdata?.userName}
                 </h3>
                 <div className='grid  grid-cols-2 ' >
                    <p className='text-center' >
                        Email:
                    </p><p className='text-center ' >
                         {userdata?.email}
                    </p>
                    {/*todo-add a bio */ }
                 </div>
                 <div className='flex items-center justify-between gap-2 ' >
                    <Link 
                    to="/changepassword"
                    className='w-1/2 focus:ring-2  text-center focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg '
                    >
                        Change password
                    </Link>

                    <Link 
                    to="/user/editprofile"
                    className='focus:ring-2  text-center focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-1/2'
                    >
                        Edit profile
                    </Link>
                 </div>
                 <div className='flex items-center justify-between gap-2 ' >
                    <Link 
                    to="/post/create"
                    className='w-full focus:ring-2  text-center focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg '
                    >
                        Create post
                    </Link>
                 </div>
                 

            </div>
        </div>
    </Homelayout>
  )
}
