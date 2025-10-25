import React from 'react';
import logo from '../assets/CCA_LOGO.png';

const Navbar = () => {
  const loggedInDean = localStorage.getItem('loggedInDean');

  const handleLogout = () => {
    localStorage.removeItem('loggedInDean');
    window.location.href = '/';
  };

  return (
    <header className='navbar bg-base-100 shadow-md px-4 flex-wrap'>
      {/* Left: Logo + Title */}
      <div className='flex items-center gap-2 flex-1'>
        <a
          href='/home'
          className='flex items-center gap-2 btn btn-ghost text-lg font-bold tracking-wide'>
          <img
            src={logo}
            alt='Dean Room Tracker Logo'
            className='w-8 h-8 object-contain'
          />
          <span className='whitespace-nowrap'>CCA Dean Room Tracker</span>
        </a>
      </div>

      {/* Desktop Nav */}
      <nav className='hidden lg:flex flex-1 justify-center'>
        <ul className='menu menu-horizontal px-1 text-sm font-medium'>
          <li>
            <a href='/home'>Home</a>
          </li>
          <li>
            <a href='/reports'>Reports</a>
          </li>
          <li>
            <a href='/employees'>Employees</a>
          </li>
          <li>
            <a href='/occupied'>Occupied Rooms</a>
          </li>
        </ul>
      </nav>

      {/* Right: Dean Info + Logout (Desktop Only) */}
      <div className='hidden lg:flex items-center gap-4 flex-none'>
        {loggedInDean && (
          <span className='text-sm text-base-content font-medium'>
            Logged in as{' '}
            <strong className='text-success'>{loggedInDean}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className='text-red-600 hover:text-red-800 font-semibold text-sm px-4'>
          Logout
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className='dropdown dropdown-end lg:hidden'>
        <label
          tabIndex={0}
          className='btn btn-ghost btn-circle'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
          <li>
            <a href='/home'>Home</a>
          </li>
          <li>
            <a href='/reports'>Reports</a>
          </li>
          <li>
            <a href='/employees'>Employees</a>
          </li>
          <li>
            <a href='/occupied'>Occupied Rooms</a>
          </li>
          {loggedInDean && (
            <li className='text-sm px-2 text-base-content'>
              Logged in as{' '}
              <strong className='text-success'>{loggedInDean}</strong>
            </li>
          )}
          <li>
            <button
              onClick={handleLogout}
              className='text-red-600 hover:text-red-800 font-semibold text-left w-full'>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
