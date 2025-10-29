import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DelSchedule = ({ scheduledID, assignedProf, onSetOccupiedTimes }) => {
  const handleDelete = async () => {
    const isLocal = window.location.hostname === 'localhost';

    const API_BASE = isLocal
      ? 'http://localhost:5001' // 👈 your local backend
      : import.meta.env.VITE_API_BASE; // 👈 your Render backend
    const confirmed = window.confirm(
      `Are you sure you want to delete the schedule for ${
        assignedProf || 'Unknown'
      }?`,
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/api/rooms/assignments/${scheduledID}`);
      toast.success(
        `Successfully deleted the schedule for ${assignedProf || 'Unknown'}`,
      );
      // ✅ Update the state to remove the deleted item
      onSetOccupiedTimes((prev) =>
        prev.filter((entry) => entry._id !== scheduledID),
      );
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('❌ Failed to delete schedule. Please try again.');
    }
  };

  return (
    <button
      className='btn btn-sm btn-warning'
      onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DelSchedule;
