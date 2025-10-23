import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DelSchedule = () => {
  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the schedule for ${
        entry.professor?.fullName || 'Unknown'
      } from ${entry.timeStart} to ${entry.timeEnd}?`,
    );
    console.log('entry', entry);
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/rooms/occupiedTime/${entry._id}`,
      );
      toast.success(
        `Successfully deleted the schedule for ${
          entry.professor?.fullName || 'Unknown'
        }`,
      );
    } catch (error) {
      console.error('Bulk delete failed:', error);
      toast.error('Bulk delete failed. Please try again.');
    }
  };
  return (
    <>
      <button className='btn btn-sm btn-warning'>Delete</button>
    </>
  );
};

export default DelSchedule;
