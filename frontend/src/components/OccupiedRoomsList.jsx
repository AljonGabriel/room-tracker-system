import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OccupiedRoomsList = () => {
  const [occupiedRooms, setOccupiedRooms] = useState([]);

  useEffect(() => {
    const getOccupiedRooms = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5001/api/rooms/assignments',
        );

        setOccupiedRooms(res.data);
      } catch (error) {
        console.error('Error fetching occupied rooms:', error);
      }
    };

    getOccupiedRooms();
  }, []);

  console.log('Occupied Rooms Data:', occupiedRooms);
  return (
    <div className='max-w-3xl mx-auto space-y-6 mt-10'>
      <div className='border rounded p-6 bg-neutral text-neutral-content border-primary'>
        <div className='space-y-4'>
          {occupiedRooms.map((slot) => (
            <div
              key={slot._id}
              className='bg-base-200 rounded-md p-4 text-sm text-base-content space-y-2'>
              <div>
                🕒 <strong>{slot.timeStart}</strong>–
                <strong>{slot.timeEnd}</strong> on{' '}
                {new Date(slot.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div>
                🏫 <strong>{slot.building}</strong>, Floor{' '}
                <strong>{slot.floor}</strong>, Room <strong>{slot.room}</strong>
              </div>
              <div>
                🎓 <strong>{slot.year}</strong> | 📘{' '}
                <strong>{slot.subject}</strong> | 🧑‍🏫{' '}
                <strong>{slot.section}</strong>
              </div>
              <div>
                Assigned by: <strong>{slot.assignedBy}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OccupiedRoomsList;
