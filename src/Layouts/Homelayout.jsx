import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Components/Footer';

export default function Homelayout({children}) {
    const dispatch=useDispatch();
    const navigate=useNavigate();

    //for checking user is logged in or not 
    //const isLoggedIn=useSelector((state)=>state?.auth?.isLoggedIn);

    //for displaying options
//    const role=useSelector((state)=>state?.auth?.role)

  return (
  <div className='min-h-[90vh]' >
    {children}
    <Footer/>
  </div>
  )
}
