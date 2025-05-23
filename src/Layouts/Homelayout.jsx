import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from '../redux/Slices/AuthSlice';
import toast from 'react-hot-toast';

export default function Homelayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn ?? false);
  const role = useSelector((state) => state?.auth?.role ?? '');

  async function handleLogout(e){
    e.preventDefault();
    const res=await dispatch(logout());
    if(res?.payload?.success){
   navigate("/")
    }
  }

  const toggleLeftDrawer = () => {
    setIsLeftDrawerOpen(!isLeftDrawerOpen);
    if (isRightDrawerOpen) setIsRightDrawerOpen(false);
  };

  const closeLeftDrawer = () => {
    setIsLeftDrawerOpen(false);
  };

  const toggleRightDrawer = () => {
    setIsRightDrawerOpen(!isRightDrawerOpen);
    if (isLeftDrawerOpen) setIsLeftDrawerOpen(false);
  };

  const closeRightDrawer = () => {
    setIsRightDrawerOpen(false);
  };

  return (
    <div className="min-h-[100vh] flex flex-row relative bg-[#121212]">
      {/* Overlay for both drawers */}
      {(isLeftDrawerOpen || isRightDrawerOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => {
            closeLeftDrawer();
            closeRightDrawer();
          }}
        ></div>
      )}

      {/* Left drawer */}
      <div
        className={`fixed left-0 top-0 h-full ${
          isLeftDrawerOpen ? 'w-80' : 'w-0'
        } lg:w-80 transition-all duration-300 z-30 bg-[#1e1e1e] shadow-sm overflow-hidden`}
      >
        <input
          id="left-drawer"
          type="checkbox"
          className="drawer-toggle hidden"
          checked={isLeftDrawerOpen}
          onChange={toggleLeftDrawer}
        />
        <ul className="menu text-white min-h-full w-80 p-4 relative z-40">
          <li className="w-fit absolute right-2 z-50 lg:hidden">
            <button onClick={closeLeftDrawer}>
              <CancelIcon fontSize="24px" />
            </button>
          </li>
          <li><Link to="/" onClick={closeLeftDrawer}>Home</Link></li>
          {isLoggedIn && role === 'admin' && (
            <li><Link to="/admin" onClick={closeLeftDrawer}>Admin Dashboard</Link></li>
          )}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow w-full p-4 z-10 lg:pl-80 lg:pr-80 bg-[#121212] overflow-y-auto min-h-[calc(100vh-64px)]">
        {/* Toggle buttons for mobile */}
        <div className="fixed top-0 left-0 right-0 flex justify-between p-4 lg:hidden z-50 bg-[#1e1e1e] shadow-sm">
          <label htmlFor="left-drawer" className="cursor-pointer">
            <MenuIcon fontSize="32px" className="text-white" />
          </label>
          <label htmlFor="right-drawer" className="cursor-pointer">
            <SettingsIcon fontSize="32px" className="text-white" />
          </label>
        </div>
        <div className="mt-16 lg:mt-0">{children}</div>
      </div>

      {/* Right drawer */}
      <div
        className={`fixed right-0 top-0 h-full ${
          isRightDrawerOpen ? 'w-80' : 'w-0'
        } lg:w-80 transition-all duration-300 z-30 bg-[#1e1e1e] shadow-sm overflow-hidden`}
      >
        <input
          id="right-drawer"
          type="checkbox"
          className="drawer-toggle hidden"
          checked={isRightDrawerOpen}
          onChange={toggleRightDrawer}
        />
        <ul className="menu text-white min-h-full w-80 p-4 relative z-40">
          <li className="w-fit absolute right-2 z-50 lg:hidden">
            <button onClick={closeRightDrawer}>
              <CancelIcon fontSize="24px" />
            </button>
          </li>
          
         {!isLoggedIn&&(
          <li className='  absolute  w-full ' >
            <div className='w-[95%] flex items-center  justify-center ' >
              <button className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-1/2 gap-2 px-2  py-1 absolute  ' >
                  <Link to="/login" >Login</Link>
              </button>
              <button className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-34 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-1/2 gap-2 px-2 mt py-1 absolute ' >
                <Link to="/signup" >Signup</Link>
              </button>
            </div>
          </li>
         )}
         {isLoggedIn&&(
          <li className='  absolute  w-full ' >
            <div className='w-[95%] flex items-center  justify-center ' >
              <button className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-3 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-1/2 gap-2 px-2  py-1 absolute  ' >
                  <Link to="/profile" >Profile</Link>
              </button>
              <button onClick={handleLogout} className='focus:ring-2  focus:ring-purple-600 focus:ring-offset-2  mt-34 hover:from-purple-700 cursor-pointer hover:to-pink-700 bg-gradient-to-r from-purple-600 to-pink-600 transition-all ease-in-out rounded-sm duration-300 py-2 font-semibold text-lg w-1/2 gap-2 px-2 mt py-1 absolute ' >
                <Link >Logout</Link>
              </button>
            </div>
          </li>
         )}
        </ul>
      </div>
    </div>
  );
}