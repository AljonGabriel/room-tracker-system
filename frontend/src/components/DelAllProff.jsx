import React from 'react';
import axios from 'axios';

const DelAllProff = () => {
  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const handleDelete = async () => {
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
      <button
        onClick={handleDelete}
        className='btn btn-error btn-sm cursor-pointer'>
        Delete Professors
      </button>
    </>
  );
};

export default DelAllProff;
