import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeleteEmployee = ({ empID, empName, setEmployees }) => {
  const storedDean = localStorage.getItem('loggedInDean');
  const dean = storedDean ? JSON.parse(storedDean) : null;

  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('loggedInDean');
    window.location.href = '/';
  };

  const isSelfDelete = dean?._id === empID; // ✅ check if deleting own account

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/employees/delEmp/${empID}`);

      if (isSelfDelete) {
        toast.success('You deleted your own account. Logging out…');
        handleLogout();
      } else {
        toast.success(`Deleted ${empName} successfully`);
        setIsOpen(false);
      }

      setEmployees((prev) => prev.filter((emp) => emp._id !== empID));
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete employee. Please try again.');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className='btn btn-sm btn-outline btn-error'
        onClick={() => setIsOpen(true)}>
        Delete
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <dialog className='modal modal-open'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg text-error'>Confirm Delete</h3>

            {/* 🧭 Dynamic message */}
            {isSelfDelete ? (
              <p className='py-2'>
                You are about to <strong>delete your own account</strong>. This
                action cannot be undone and you will be logged out immediately.
              </p>
            ) : (
              <p className='py-2'>
                Are you sure you want to delete <strong>{empName}</strong>?
              </p>
            )}

            <div className='modal-action'>
              <button
                className='btn btn-outline'
                onClick={() => setIsOpen(false)}>
                Cancel
              </button>

              {/* 🔄 Dynamic button label */}
              <button
                className='btn btn-error'
                onClick={handleDelete}>
                {isSelfDelete
                  ? 'Delete My Account & Logout'
                  : `Delete ${empName}`}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DeleteEmployee;
