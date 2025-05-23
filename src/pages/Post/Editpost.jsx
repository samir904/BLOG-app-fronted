import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toastStyles from '../../Helpers/Toaststyle';
import { updatePost, getPost } from '../../redux/Slices/PostSlice';
import Homelayout from '../../Layouts/Homelayout';

export default function Editpost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { post, loading, error } = useSelector((state) => state.post);

  const [formdata, setformdata] = useState({
    content: "",
    media: "",
  });
  const [previewmedia, setpreviewmedia] = useState("");
  const [mediaType, setmediaType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        toast.error("Invalid post ID", toastStyles.error);
        navigate("/");
        return;
      }

      const promise = dispatch(getPost(id));
      toast.promise(
        promise,
        {
          loading: "Loading post...",
          success: "Post loaded successfully",
          error: (err) => err || "Failed to load post",
        },
        {
          loading: toastStyles.loading,
          success: toastStyles.success,
          error: toastStyles.error,
        }
      );

      const response = await promise;
      if (response.error || !response.payload) {
        navigate("/");
      }
      setFetchAttempted(true);
    };
    fetchPost();
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (post && post._id === id) {
      setformdata({
        content: post.content || "",
        media: "",
      });
      setpreviewmedia(post.media?.secure_url || "");
      if (post.media?.secure_url) {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mkv'];
        const isVideo = videoExtensions.some(ext => post.media.secure_url.toLowerCase().endsWith(ext));
        setmediaType(isVideo ? 'video' : 'image');
      }
    }
  }, [post, id]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value,
    });
  }

  function handleMediaUpload(e) {
    e.preventDefault();
    const uploadedmedia = e.target.files[0];
    if (!uploadedmedia) return;

    const fileType = uploadedmedia.type;
    if (fileType.startsWith('image/')) {
      setmediaType('image');
    } else if (fileType.startsWith('video/')) {
      setmediaType('video');
    } else {
      toast.error("Please upload an image or video file", toastStyles.error);
      return;
    }

    setformdata({
      ...formdata,
      media: uploadedmedia,
    });

    const filereader = new FileReader();
    filereader.readAsDataURL(uploadedmedia);
    filereader.addEventListener("load", function () {
      setpreviewmedia(this.result);
    });
  }

  async function handleFormsubmit(e) {
    e.preventDefault();
    if (!formdata.content) {
      toast.error("Content is required", toastStyles.error);
      return;
    }
    if (formdata.content.length < 2) {
      toast.error("Content must be at least two characters", toastStyles.error);
      return;
    }

    // Validate id before dispatching
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      toast.error("Invalid or missing post ID", toastStyles.error);
      setIsSubmitting(false);
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    const formres = new FormData();
    formres.append("content", formdata.content);
    if (formdata.media) {
      formres.append("media", formdata.media);
    }

    // Debug logging
    console.log("Submitting with id:", id);
    console.log("FormData contents:");
    for (let [key, value] of formres.entries()) {
      console.log(`${key}:`, value);
    }

    const res = await dispatch(updatePost({ id, formData: formres }));
    setIsSubmitting(false);

    console.log("this is the dispatch response",res)
    if (res?.payload?.success) {
      toast.success("Post updated successfully", toastStyles.success);
      navigate(`/post/${id}`);
      setformdata({
        content: "",
        media: "",
      });
      setpreviewmedia("");
      setmediaType("");
    } else {
      toast.error(res?.payload?.message || " dispatch Failed to update post", toastStyles.error);
    }
  }

  if (loading || !fetchAttempted) {
    return (
      <Homelayout>
        <div className="flex justify-center items-center h-screen text-white">
          <svg
            className="animate-spin h-8 w-8 text-purple-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </Homelayout>
    );
  }

  if (error || !post || post._id !== id) {
    return (
      <Homelayout>
        <div className="flex justify-center items-center h-screen text-gray-300">
          <p>{error || "Post not found"}</p>
        </div>
      </Homelayout>
    );
  }

  return (
    <Homelayout>
      <div className="flex justify-center items-center h-screen text-white">
        <form
          className="flex flex-col rounded-lg justify-center items-center gap-3 p-4 w-96 shadow-[0_0_10px_purple]"
          onSubmit={handleFormsubmit}
        >
          <h1 className="text-2xl text-center font-semibold">Edit Your Post</h1>

          <div className="w-full">
            <textarea
              name="content"
              value={formdata.content}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              className="w-full p-2 rounded-lg bg-[#2a2a2a] text-white border-none resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="media"
              className="flex items-center justify-center w-full h-48 bg-[#2a2a2a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              {previewmedia ? (
                mediaType === 'image' ? (
                  <img
                    src={previewmedia}
                    alt="Media preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={previewmedia}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-cover rounded-lg"
                  />
                )
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-gray-400">Upload new media (optional)</span>
                </div>
              )}
            </label>
            <input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className={`w-full py-2 hover:from-purple-700 cursor-pointer rounded-sm hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-colors ${
              (loading || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading || isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Update Post"
            )}
          </button>
        </form>
      </div>
    </Homelayout>
  );
}