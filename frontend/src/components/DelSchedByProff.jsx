import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DelSchedByProff = ({ profID, profName, refreshRooms }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isLocal = window.location.hostname === 'localhost';
  const API_BASE = isLocal
    ? 'http://localhost:5001'
    : import.meta.env.VITE_API_BASE;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/rooms/byprof/${profID}`);
      toast.success(
        `Deleted ${res.data.deletedCount} room(s) assigned to ${profName}`,
      );
      refreshRooms?.(); // optional callback to refresh room list
    } catch (error) {
      console.error('Error deleting rooms:', error);
      toast.error('Failed to delete assigned rooms');
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className='btn btn-sm btn-outline btn-warning'
        onClick={() => setIsOpen(true)}>
        Delete Assigned Rooms
      </button>

      {isOpen && (
        <dialog className='modal modal-open'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg text-warning'>Confirm Delete</h3>
            <p className='py-2'>
              Are you sure you want to delete all rooms assigned to{' '}
              <strong>{profName}</strong>?
            </p>
            <div className='modal-action'>
              <button
                className='btn btn-outline'
                onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className='btn btn-warning'
                onClick={handleDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DelSchedByProff;
