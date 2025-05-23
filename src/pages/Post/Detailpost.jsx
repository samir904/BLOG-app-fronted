import React, { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, likePost, createComment, deletePost, updateComment, deleteComment } from '../../redux/Slices/PostSlice';
import Homelayout from '../../Layouts/Homelayout';
import toastStyles from '../../Helpers/Toaststyle';
import { FiArrowLeft, FiHeart, FiSend, FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Detailpost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { post, loading, error } = useSelector((state) => {
    console.log("Detailpost - Redux state on render:", state.post);
    return state.post;
  });
  const authState = useSelector((state) => {
    console.log("Detailpost - Auth state on render:", state.auth);
    return state.auth;
  });
  const user = authState?.data || null;

  const [mediaError, setMediaError] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [commentSettingsOpen, setCommentSettingsOpen] = useState(null);

  useEffect(() => {
    console.log("Detailpost - Extracted post ID from URL:", id);
    if (!id) {
      console.log("Detailpost - No post ID provided, redirecting to homepage");
      toast.error("Invalid post ID", toastStyles.error);
      navigate("/");
      return;
    }

    const fetchPost = async () => {
      console.log("Detailpost - Current post state before fetch:", post);
      console.log("Detailpost - Dispatching getPost with ID:", id);

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
      console.log("Detailpost - getPost response:", response);
      if (response.error || !response.payload) {
        console.log("Detailpost - getPost failed, redirecting to homepage. Error:", response.error?.message);
        navigate("/");
      }
      setFetchAttempted(true);
      console.log("Detailpost - Fetch attempted, post state:", post);
    };

    fetchPost();
  }, [dispatch, id, navigate]);

  const isVideo = useMemo(() => {
    if (post?.media?.type) {
      return post.media.type === "video";
    }
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mkv'];
    return post?.media?.secure_url && videoExtensions.some(ext => post.media.secure_url.toLowerCase().endsWith(ext));
  }, [post?.media]);

  const hasMedia = useMemo(() => {
    return post?.media?.secure_url && !mediaError;
  }, [post?.media, mediaError]);

  const handleLikeToggle = useCallback(async () => {
    if (!user?._id) {
      toast.error("Please log in to like posts", toastStyles.error);
      return;
    }

    const isLiked = post?.likes?.includes(user._id);
    console.log("Detailpost - Toggling like for post:", post._id, "Is liked:", isLiked);
    const promise = dispatch(likePost(post._id));
    toast.promise(
      promise,
      {
        loading: isLiked ? "Unliking post..." : "Liking post...",
        success: (data) => {
          dispatch(getPost(post._id));
          return isLiked ? "Post unliked" : "Post liked";
        },
        error: (err) => err || "Failed to toggle like",
      },
      {
        loading: toastStyles.loading,
        success: toastStyles.success,
        error: toastStyles.error,
      }
    );
  }, [dispatch, post, user]);

  const handleCommentSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please log in to comment", toastStyles.error);
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty", toastStyles.error);
      return;
    }

    const promise = dispatch(createComment({ postId: id, content: commentContent }));
    toast.promise(
      promise,
      {
        loading: "Adding comment...",
        success: (data) => {
          dispatch(getPost(id));
          return "Comment added successfully";
        },
        error: (err) => err || "Failed to add comment",
      },
      {
        loading: toastStyles.loading,
        success: toastStyles.success,
        error: toastStyles.error,
      }
    );

    const response = await promise;
    if (!response.error) {
      setCommentContent('');
    }
  }, [dispatch, id, commentContent, user]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEditPost = useCallback(() => {
    navigate(`/edit-post/${post._id}`);
    setShowSettings(false);
  }, [navigate, post?._id]);

  const handleDeletePost = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await dispatch(deletePost(post._id));
        if (response.payload?.success) {
          toast.success("Post deleted successfully", toastStyles.success);
          navigate("/");
        } else {
          toast.error("Failed to delete post", toastStyles.error);
        }
      } catch (error) {
        toast.error("Failed to delete post", toastStyles.error);
      }
    }
    setShowSettings(false);
  }, [dispatch, post?._id, navigate]);

  const handleEditComment = useCallback((commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
    setCommentSettingsOpen(null);
  }, []);

  const handleSaveComment = useCallback(async (commentId) => {
    if (!editedCommentContent.trim()) {
      toast.error("Comment cannot be empty", toastStyles.error);
      return;
    }

    const promise = dispatch(updateComment({ commentId, content: editedCommentContent }));
    toast.promise(
      promise,
      {
        loading: "Updating comment...",
        success: "Comment updated successfully",
        error: (err) => err || "Failed to update comment",
      },
      {
        loading: toastStyles.loading,
        success: toastStyles.success,
        error: toastStyles.error,
      }
    );

    const response = await promise;
    if (!response.error) {
      setEditingCommentId(null);
      setEditedCommentContent('');
      dispatch(getPost(id)); // Refetch the post to update the UI
    }
  }, [dispatch, id, editedCommentContent]);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditedCommentContent('');
  }, []);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const promise = dispatch(deleteComment({ postId: id, commentId }));
      toast.promise(
        promise,
        {
          loading: "Deleting comment...",
          success: "Comment deleted successfully",
          error: (err) => err || "Failed to delete comment",
        },
        {
          loading: toastStyles.loading,
          success: toastStyles.success,
          error: toastStyles.error,
        }
      );

      const response = await promise;
      if (!response.error) {
        dispatch(getPost(id)); // Refetch the post to update the UI
      }
    }
    setCommentSettingsOpen(null);
  }, [dispatch, id]);

  console.log("Detailpost - Rendering. Loading:", loading, "Error:", error, "Post:", post, "ID:", id, "FetchAttempted:", fetchAttempted);
  if (loading) {
    console.log("Detailpost - Rendering loading state");
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

  if (error) {
    console.log("Detailpost - Rendering error state:", error);
    return (
      <Homelayout>
        <div className="flex justify-center items-center h-screen text-gray-300">
          <p>{error}</p>
        </div>
      </Homelayout>
    );
  }

  if (!fetchAttempted) {
    console.log("Detailpost - Waiting for fetch to complete");
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

  if (!post || post._id !== id) {
    console.log("Detailpost - Post not loaded or ID mismatch after fetch. Post:", post, "ID:", id);
    return (
      <Homelayout>
        <div className="flex justify-center items-center h-screen text-gray-300">
          <p>Post not found</p>
        </div>
      </Homelayout>
    );
  }

  console.log("Detailpost - Rendering post details for ID:", id);
  const isLiked = post.likes.includes(user?._id);

  // Calculate isPostOwner after all guards to ensure post and user are available
  console.log("Detailpost - Checking isPostOwner. User:", user, "Post user:", post?.user);
  const isPostOwner = user?._id && post?.user?._id && post?.user?._id.toString() === user?._id.toString();

  return (
    <Homelayout>
      <div className="bg-[#1e1e1e] p-3 sm:p-4 md:p-6 rounded-lg shadow-sm w-full max-w-[37rem] mx-auto my-2 sm:my-4">
        {/* Back Button and Settings */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-purple-500"
          >
            <FiArrowLeft className="w-6 h-6 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          {isPostOwner && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-300 hover:text-purple-500 p-1"
                aria-label="Post settings"
              >
                <FiMoreVertical className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-[#2a2a2a] rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEditPost}
                    className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] hover:text-white text-sm sm:text-base"
                  >
                    <FiEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                    Edit Post
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] hover:text-red-500 text-sm sm:text-base"
                  >
                    <FiTrash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Header: Avatar, Username, Date */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {post.user?.avatar?.secure_url ? (
            <img
              src={post.user.avatar.secure_url}
              alt={`Profile image of ${post.user.userName}`}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40?text=U";
              }}
            />
          ) : (
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base"
              aria-label={`Avatar of ${post.user.userName}`}
            >
              {post.user?.userName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl capitalize text-white leading-tight">
              {post.user?.userName || "Unknown User"}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Post Media */}
        {hasMedia ? (
          mediaError ? (
            <div className="w-full h-92 sm:h-64 md:h-96 lg:h-[80vh] bg-gray-600 rounded-lg mb-3 sm:mb-4 flex items-center justify-center text-gray-300 text-sm sm:text-base">
              Failed to load media
            </div>
          ) : isVideo ? (
            <div className="w-full h-92 sm:h-64 md:h-96 lg:h-[80vh] rounded-lg mb-3 sm:mb-4">
              <video
                src={post.media.secure_url}
                controls
                controlsList="nodownload"
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error("Detailpost - Video failed to load:", post.media.secure_url);
                  setMediaError(true);
                  toast.error("Unsupported video format or failed to load video", toastStyles.error);
                }}
              >
                <source src={post.media.secure_url} type={post.media.format || "video/mp4"} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-full h-92 sm:h-64 md:h-96 lg:h-[80vh] rounded-lg mb-3 sm:mb-4">
              <img
                src={post.media.secure_url}
                alt={post.media.alt || "Post media"}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error("Detailpost - Image failed to load:", post.media.secure_url);
                  setMediaError(true);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Media+Error";
                }}
              />
            </div>
          )
        ) : (
          <div className="w-full h-92 sm:h-64 md:h-96 lg:h-[80vh] bg-gray-600 rounded-lg mb-3 sm:mb-4 flex items-center justify-center text-gray-300 text-sm sm:text-base">
            No media available
          </div>
        )}

        {/* Post Content */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">{post.content}</p>

        {/* Likes Section with Like/Unlike Button */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 sm:gap-2 text-sm ${
              isLiked ? "text-red-500" : "text-gray-300"
            } p-1 sm:p-2`}
          >
            <FiHeart
              className={`w-5 h-5 sm:w-5 sm:h-5 ${isLiked ? "fill-red-500" : "fill-none"}`}
            />
            <span>
              {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-600 pt-3 sm:pt-4">
          <h3 className="text-base sm:text-lg text-white mb-2 sm:mb-3">Comments ({post.comments.length})</h3>
          {post.comments.length > 0 ? (
            post.comments.map((comment) => {
              const isCommentOwner = user?._id && comment?.user?._id && comment.user._id.toString() === user._id.toString();
              const isEditing = editingCommentId === comment._id;

              return (
                <div key={comment._id} className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {/* Commenter Avatar */}
                  {comment.user?.avatar?.secure_url ? (
                    <img
                      src={comment.user.avatar.secure_url}
                      alt={`Profile image of ${comment.user.userName}`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40?text=U";
                      }}
                    />
                  ) : (
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm"
                      aria-label={`Avatar of ${comment.user.userName}`}
                    >
                      {comment.user?.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {/* Comment Details */}
                  <div className="flex-1">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-300 font-semibold text-sm capitalize">
                          {comment.user?.userName || "Unknown User"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {isCommentOwner && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setCommentSettingsOpen(
                                commentSettingsOpen === comment._id ? null : comment._id
                              )
                            }
                            className="text-gray-300 hover:text-purple-500 p-1"
                            aria-label="Comment settings"
                          >
                            <FiMoreVertical className="w-5 h-5 sm:w-5 sm:h-5" />
                          </button>
                          {commentSettingsOpen === comment._id && (
                            <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-[#2a2a2a] rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleEditComment(comment._id, comment.content)}
                                className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] hover:text-white text-sm sm:text-base"
                              >
                                <FiEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                                Edit Comment
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] hover:text-red-500 text-sm sm:text-base"
                              >
                                <FiTrash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                                Delete Comment
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          className="w-full p-2 bg-[#2a2a2a] text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 resize-none text-sm sm:text-base"
                          rows="2"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveComment(comment._id)}
                            className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{comment.content}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">No comments yet.</p>
          )}

          {/* Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="mt-3 sm:mt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 bg-[#2a2a2a] text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 resize-none text-sm sm:text-base"
                rows="2"
              />
              <button
                type="submit"
                className="flex items-center justify-center p-2 sm:p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200"
              >
                <FiSend className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Homelayout>
  );
}