import React from 'react';
import axios from 'axios';

const DelAllProff = () => {
  const storedDean = localStorage.getItem('loggedInDean');
  const loggedInDean = storedDean ? JSON.parse(storedDean) : null;

  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete ALL professors? This action cannot be undone.',
    );

    if (!confirmed) return; // stop if user cancels

    try {
      const res = await axios.delete(
        `${API_BASE}/api/employees/delete/allproff`,
      );

      alert(`${res.data.deletedCount} professors deleted successfully!`);
    } catch (error) {
      console.error('Error deleting professors:', error);
      alert('Failed to delete professors');
    }
  };

  return (
    <>
      {loggedInDean?.role === 'SuperAdmin' && (
        <button
          onClick={handleDelete}
          className='btn btn-error btn-sm cursor-pointer'>
          Delete Professors
        </button>
      )}
    </>
  );
};

export default DelAllProff;
