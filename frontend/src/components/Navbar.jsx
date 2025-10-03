import React from "react";
import logo from "../assets/CCA_LOGO.png";

const Navbar = () => {
  return (
    <header className="navbar bg-base-100 shadow-md px-4">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-6 flex-1">
        {/* Logo */}
        <a
          href="/home"
          className="flex items-center gap-2 btn btn-ghost text-xl font-bold tracking-wide"
        >
          <img
            src={logo}
            alt="Dean Room Tracker Logo"
            className="w-8 h-8 object-contain"
          />
          CCA Dean Room Tracker
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-sm font-medium">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/reports">Reports</a>
            </li>
            <li>
              <a href="/employees">Employees</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right: Logout */}
      <div className="flex-none">
        <a
          href="/"
          className="text-red-600 hover:text-red-800 font-semibold text-sm px-4"
        >
          Logout
        </a>
      </div>

      {/* Mobile Dropdown */}
      <div className="dropdown dropdown-end lg:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/reports">Reports</a>
          </li>
          <li>
            <a href="/employees">Employees</a>
          </li>
          <li>
            <a
              href="/"
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
