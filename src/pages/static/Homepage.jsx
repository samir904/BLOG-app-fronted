import React, { useEffect } from 'react';
import Homelayout from '../../Layouts/Homelayout';
import { Link } from 'react-router-dom';
import PostCard from './Postcard.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPost } from '../../redux/Slices/PostSlice.js';

export default function Homepage() {
  const dispatch = useDispatch();
  const { allPost, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPost());
  }, [dispatch]);

  const SkeletonCard = () => (
    <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-sm w-full animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-600 rounded w-1/3 mb-1"></div>
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-40 bg-gray-600 rounded-lg mb-3 w-full"></div>
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      <div className="flex justify-between mt-3">
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-600 rounded mt-1"></div>
          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-600 rounded mt-1"></div>
        </div>
        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold text-white">
              All the posts are here
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Create Post
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </Homelayout>
    );
  }

  if (error) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold text-white">
              All the posts are here
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Create Post
            </Link>
          </div>
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => dispatch(getAllPost())}
              className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </Homelayout>
    );
  }

  if (!loading && allPost.length === 0) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold text-white">
              All the posts are here
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Create Post
            </Link>
          </div>
          <p className="text-center text-gray-300">
            No posts available. Be the first to create one!
          </p>
        </div>
      </Homelayout>
    );
  }

  return (
    <Homelayout>
      <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-center lg:text-left text-3xl font-semibold text-white">
            All the posts are here
          </h1>
          <Link
            to="/post/create"
            className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Create Post
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {allPost.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </Homelayout>
  );
}