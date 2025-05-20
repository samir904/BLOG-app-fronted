import React, { useState } from 'react'
import Homelayout from '../../Layouts/Homelayout'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import toastStyles from '../../Helpers/Toaststyle';
import { isValidPassword } from '../../Helpers/regexMatch';
import { changepassword } from '../../redux/Slices/AuthSlice';

export default function Changepassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fromdata, setformdata] = useState({
        oldPassword: "",
        newPassword: ""
    })

    function handleinputchange(e) {
        const { name, value } = e.target;
        setformdata({
            ...fromdata,
            [name]: value
        })
    }

    async function handleformsubmit(e) {
        e.preventDefault();
        if (!fromdata.oldPassword || !fromdata.newPassword) {
            toast.error("All fields are required", toastStyles.error)
            return;
        }
        if (!isValidPassword(fromdata.newPassword)) {
            toast.error("New password must have an uppercase and lowercase and a special character minimum 8 character", toastStyles.error)
            return;
        }

        const res = await dispatch(changepassword(fromdata));
        if (res?.payload?.success) {
            navigate("/profile")
            setformdata({
                oldPassword: "",
                newPassword: ""
            })
        }

    }

    return (
        <Homelayout>
            <div className='flex items-center justify-center h-screen ' >
                <form
                onSubmit={handleformsubmit}
                    noValidate
                    className='flex flex-col rounded-md shadow-[0_0_10px_purple] gap-2 text-white w-96 p-4 py-6 '
                >
                    <h1 className='text-center text-2xl font-semibold' >
                        Change password from
                    </h1>

                    <div className='flex flex-col gap-2 ' >
                        <label
                            className='font-semibold '
                            htmlFor="oldPassword">
                            Old password
                        </label>
                        <input
                        required
                            className='bg-transparent border py-2 px-2 rounded-sm '
                            type="password"
                            placeholder='Enter the old password'
                            onChange={handleinputchange}
                            name='oldPassword'
                            value={fromdata.oldPassword}
                        />
                    </div>
                    <div className='flex flex-col gap-2 ' >
                        <label
                            className='font-semibold '
                            htmlFor="newPassword">
                            New password
                        </label>
                        <input
                        required
                            className='bg-transparent border py-2 px-2 rounded-sm '
                            type="password"
                            placeholder='Enter the new password'
                            onChange={handleinputchange}
                            name='newPassword'
                            value={fromdata.newPassword}
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
