import React, { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { likePost } from '../../redux/Slices/PostSlice';
import toastStyles from '../../Helpers/Toaststyle';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, data } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.post);
  const [expand, setExpand] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  console.log("PostCard post object:", post);
  console.log("PostCard post.media:", post.media);

  const hasLiked = useMemo(() => {
    return isLoggedIn && post.likes.some((likeId) => likeId.toString() === data?._id);
  }, [isLoggedIn, post.likes, data]);

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isLoggedIn) {
        toast.error("Please login to like a post", toastStyles.error);
        return;
      }
      if (isLiking) return;

      setIsLiking(true);
      try {
        await dispatch(likePost(post._id));
      } catch (error) {
        toast.error("Failed to toggle like", toastStyles.error);
      } finally {
        setIsLiking(false);
      }
    },
    [isLoggedIn, post._id, isLiking, dispatch]
  );

  const handleShare = useCallback(() => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      toast.success("Post URL copied to clipboard!", toastStyles.success);
    });
  }, [post._id]);

  const handleNavigateToPost = useCallback((e) => {
    // Prevent navigation if the click is on the video controls
    if (e.target.tagName !== 'VIDEO') {
      navigate(`/post/${post._id}`);
    }
  }, [navigate, post._id]);

  const isVideo = useMemo(() => {
    if (post.media?.type) {
      const result = post.media.type === "video";
      console.log("isVideo based on type:", result, "type:", post.media.type);
      return result;
    }
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mkv'];
    const result = post.media?.secure_url && videoExtensions.some(ext => post.media.secure_url.toLowerCase().endsWith(ext));
    console.log("isVideo based on extension:", result, "secure_url:", post.media?.secure_url);
    return result;
  }, [post.media]);

  return (
    <div className="bg-[#1e1e1e] p-3 sm:p-4 rounded-lg shadow-sm w-full max-w-[37rem] mx-auto">
      {/* Header: Avatar, Username, Date */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        {post.user.avatar?.secure_url ? (
          <img
            src={post.user.avatar.secure_url}
            alt={`Profile image of ${post.user.userName}`}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40?text=U";
            }}
          />
        ) : (
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base"
            aria-label={`Avatar of ${post.user.userName}`}
          >
            {post.user.userName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl capitalize text-white">
            {post.user.userName}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Media: Image or Video */}
      {post.media?.secure_url ? (
        mediaError ? (
          <div className="w-full h-64 sm:h-96 lg:h-[80vh] bg-gray-600 rounded-lg mb-3 flex items-center justify-center text-gray-300">
            Failed to load media
          </div>
        ) : isVideo ? (
          <video
            src={post.media.secure_url}
            controls
            controlsList="nodownload" // Disable download option
            autoPlay // Enable autoplay
            muted // Required for autoplay to work in most browsers
            loop // Optional: Make the video loop
            className="w-full h-64 sm:h-96 lg:h-[80vh] object-cover rounded-lg mb-3 cursor-pointer"
            onClick={handleNavigateToPost}
            onError={(e) => {
              console.error("Video failed to load:", post.media.secure_url);
              setMediaError(true);
              toast.error("Unsupported video format or failed to load video", toastStyles.error);
            }}
          >
            <source src={post.media.secure_url} type={post.media.format || "video/mp4"} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={post.media.secure_url}
            alt={post.media.alt || "Post media"}
            className="w-full h-64 sm:h-96 lg:h-[80vh] object-cover rounded-lg mb-3 cursor-pointer"
            onClick={handleNavigateToPost}
            onError={(e) => {
              console.error("Image failed to load:", post.media.secure_url);
              setMediaError(true);
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=Media+Error";
            }}
          />
        )
      ) : (
        <div className="w-full h-64 sm:h-96 lg:h-[80vh] bg-gray-600 rounded-lg mb-3 flex items-center justify-center text-gray-300">
          No media available
        </div>
      )}

      {/* Content Preview */}
      <p className="text-gray-300 mb-3 text-sm sm:text-base">
        {post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleLike}
            disabled={loading || isLiking}
            className={`flex cursor-pointer items-center gap-1 text-gray-300 hover:text-red-500 ${
              hasLiked ? "text-red-500" : ""
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={hasLiked ? "Unlike post" : "Like post"}
          >
            {isLiking ? (
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-red-500"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={hasLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            <span className="text-xs sm:text-sm">{post.likes.length}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center cursor-pointer gap-1 text-gray-300 hover:text-purple-500"
            aria-label="Share post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNavigateToPost}
            className="flex cursor-pointer items-center gap-1 text-gray-300 hover:text-purple-500"
            aria-label="View comments"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="text-xs sm:text-sm">{post.comments.length}</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setExpand(!expand)}
          className="text-gray-300 hover:text-purple-500 cursor-pointer transition-transform duration-300"
          aria-label={expand ? "Collapse content" : "Expand content"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${expand ? "rotate-180" : "rotate-0"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Content */}
      {expand && (
        <div className="mt-3 border-t border-gray-600 pt-3">
          <p className="text-gray-300 text-sm sm:text-base">{post.content}</p>
        </div>
      )}
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.post._id === nextProps.post._id &&
    prevProps.post.likes.length === nextProps.post.likes.length &&
    prevProps.post.likes.every((likeId, index) => likeId === nextProps.post.likes[index]) &&
    prevProps.post.comments.length === nextProps.post.comments.length &&
    prevProps.post.content === nextProps.post.content &&
    prevProps.post.media?.secure_url === nextProps.post.media?.secure_url &&
    prevProps.post.media?.type === nextProps.post.media?.type
  );
};

export default React.memo(PostCard, areEqual);