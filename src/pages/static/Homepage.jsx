import React, { useEffect } from 'react';
import Homelayout from '../../Layouts/Homelayout';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import PostCard from './Postcard.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPost } from '../../redux/Slices/PostSlice.js';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import UploadIcon from '@mui/icons-material/Upload';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { allPost, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPost());
  }, [dispatch]);

  const actions = [
    {
      name: 'Upload Post',
      onClick: () => navigate('/post/create'), // Updated to use navigate
    },
  ];

  const theme = createTheme({
    palette: {
      mode: 'dark', // Match the app's dark theme
    },
  });

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

  // Common SpeedDial component to avoid repetition
  const renderSpeedDial = () => (
    <ThemeProvider theme={theme}>
      <SpeedDial
        ariaLabel="SpeedDial for creating post"
        className="lg:hidden"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 50,
          '& .MuiSpeedDial-fab': {
            background: 'linear-gradient(to right, #7C3AED, #EC4899)',
            '&:hover': {
              background: 'linear-gradient(to right, #6D28D9, #DB2777)',
            },
            '&:focus': {
              boxShadow: '0 0 0 4px #7C3AED, 0 0 0 6px rgba(255, 255, 255, 0.1)',
            },
          },
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UploadIcon />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {action.name}
                </Typography>
              </Box>
            }
            onClick={action.onClick}
            sx={{
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                background: 'linear-gradient(to right, #7C3AED, #EC4899)', // Match SpeedDial gradient
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
              },
            }}
          />
        ))}
      </SpeedDial>
    </ThemeProvider>
  );

  if (loading) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              SnipStory
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 mt-3 cursor-pointer"
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
        {renderSpeedDial()}
      </Homelayout>
    );
  }

  if (error) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              SnipStory
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 mt-3 cursor-pointer"
            >
              Create Post
            </Link>
          </div>
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => dispatch(getAllPost())}
              className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
        {renderSpeedDial()}
      </Homelayout>
    );
  }

  if (!loading && allPost.length === 0) {
    return (
      <Homelayout>
        <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-center lg:text-left text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              SnipStory
            </h1>
            <Link
              to="/post/create"
              className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 mt-3 cursor-pointer"
            >
              Create Post
            </Link>
          </div>
          <p className="text-center text-gray-300">
            No posts available. Be the first to create one!
          </p>
        </div>
        {renderSpeedDial()}
      </Homelayout>
    );
  }

  return (
    <Homelayout>
      <div className="pt-6 px-4 lg:px-6 flex flex-col gap-6 bg-[#121212] min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-center lg:text-left text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            SnipStory
          </h1>
          <Link
            to="/post/create"
            className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 mt-3 cursor-pointer"
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
      {renderSpeedDial()}
    </Homelayout>
  );
}