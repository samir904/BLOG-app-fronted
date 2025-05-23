import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toastStyles from '../../Helpers/Toaststyle';
import { createNewPost } from '../../redux/Slices/PostSlice';
import Homelayout from '../../Layouts/Homelayout';

export default function Createpost() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formdata, setformdata] = useState({
        content: "",
        media: ""
    });
    const [previewmedia, setpreviewmedia] = useState("");
    const [mediaType, setMediaType] = useState(""); // Track whether the media is image or video

    function handleInputChange(e) {
        const { name, value } = e.target;
        setformdata({
            ...formdata,
            [name]: value
        });
    }

    function handleMediaUpload(e) {
        e.preventDefault();
        const uploadedmedia = e.target.files[0];
        if (!uploadedmedia) return;

        // Determine the media type (image or video)
        const fileType = uploadedmedia.type.split('/')[0]; // "image" or "video"
        setMediaType(fileType);

        // Update formdata with the uploaded file
        setformdata({
            ...formdata,
            media: uploadedmedia
        });

        // Generate preview URL using FileReader
        const filereader = new FileReader();
        filereader.readAsDataURL(uploadedmedia);
        filereader.addEventListener("load", function () {
            setpreviewmedia(this.result);
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!formdata.content || !formdata.media) {
            toast.error("All fields are required", toastStyles.error);
            return;
        }
        if (formdata.content.length < 2) {
            toast.error("Content must be at least 2 characters", toastStyles.error);
            return;
        }
        const formres = new FormData();
        formres.append("content", formdata.content);
        formres.append("media", formdata.media);
        const res = await dispatch(createNewPost(formres));
        if (res?.payload?.success) {
            navigate("/");
            setformdata({
                content: "",
                media: ""
            });
            setpreviewmedia("");
            setMediaType("");
        }
    }

    return (
        <Homelayout>
            <div className='flex justify-center items-center h-screen text-white'>
                <form
                    onSubmit={handleFormSubmit}
                    className='flex flex-col rounded-lg justify-center items-center gap-3 p-4 w-96 shadow-[0_0_10px_purple]'
                >
                    <h1 className='text-2xl text-center font-semibold'>
                        Create your post
                    </h1>

                    {/* Content Input */}
                    <div className='w-full'>
                        <label htmlFor="content" className='text-sm font-medium'>
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formdata.content}
                            onChange={handleInputChange}
                            placeholder="Write your post content..."
                            className='w-full resize-none p-2 mt-1 rounded-md bg-[#2e2e2e] text-white border border-gray-600 focus:outline-none focus:border-purple-500'
                            rows="4"
                        />
                    </div>

                    {/* Media Upload */}
                    <div className='w-full'>
                        <label htmlFor="media" className='text-sm font-medium'>
                            Upload Media (Image or Video)
                        </label>
                        <div className='mt-1'>
                            <label
                                htmlFor="media"
                                className='cursor-pointer flex justify-center items-center w-full h-40 border-2 border-dashed border-gray-600 rounded-md bg-[#2e2e2e] hover:border-purple-500 transition-colors'
                            >
                                {previewmedia ? (
                                    mediaType === "image" ? (
                                        <img
                                            src={previewmedia}
                                            alt="Media preview"
                                            className='w-full h-full object-cover rounded-md'
                                        />
                                    ) : (
                                        <video
                                            src={previewmedia}
                                            controls
                                            className='w-full h-full object-cover rounded-md'
                                        />
                                    )
                                ) : (
                                    <div className='flex flex-col items-center justify-center'>
                                        {/* Upload Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-10 h-10 text-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16V8m0 0l-3 3m3-3l3 3m-6 6h12m-6-4v4m-4-8h8m-4-4v4"
                                            />
                                        </svg>
                                        <span className='text-gray-400 mt-2'>
                                            Upload an image or video
                                        </span>
                                    </div>
                                )}
                                <input
                                    id="media"
                                    name="media"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleMediaUpload}
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-full   '

                    >
                        Create Post
                    </button>
                </form>
            </div>
        </Homelayout>
    );
}