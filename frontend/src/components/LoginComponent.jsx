import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginComponent = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 start loading

    try {
      const { data: users } = await axios.get(
        `${API_BASE}/api/employees/getemp`,
      );
      const deans = users.filter((user) => user.role === 'Dean');
      const matchedDean = deans.find(
        (dean) => dean.username === email && dean.pwd === password,
      );

      if (matchedDean) {
        localStorage.setItem('loggedInDean', matchedDean.fullName);
        navigate('/home');
      } else {
        toast.error('Invalid credentials. Try again 😅');
      }
    } catch (error) {
      toast.error('Login failed. Please check your connection.');
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4'
      data-theme='dark'>
      <div className='w-full max-w-md bg-base-200 shadow-xl rounded-xl p-8 space-y-6'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-primary'>Welcome Back</h1>
          <p className='text-sm text-base-content'>Login to your account</p>
        </div>

        {/* Form */}
        <form
          className='space-y-4'
          onSubmit={handleLogin}>
          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text text-base-content'>Username</span>
            </label>
            <input
              type='text'
              placeholder='DeanOne'
              className='input input-bordered w-full bg-base-100 text-base-content'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label'>
              <span className='label-text text-base-content'>Password</span>
            </label>
            <input
              type='password'
              placeholder='••••••••'
              className='input input-bordered w-full bg-base-100 text-base-content'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type='submit'
            className={`btn btn-primary w-full ${
              loading ? 'btn-disabled' : ''
            }`}>
            {loading ? (
              <span className='loading loading-spinner loading-sm'></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className='text-center text-xs text-base-content opacity-60'>
          <p>© 2025 Schedule System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
