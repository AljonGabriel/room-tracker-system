import React, { useEffect, useState } from 'react';
import axios from 'axios';
import colorPalette from '../data/colorPalette.js';
import UpdateSchedule from './UpdateSchedule.jsx';
import DelSchedule from './DelSchedule.jsx';
import buildingData from '../data/buildingData.js';
import subjectsByYear from '../data/subjectsByYear.js';
import sections from '../data/sections.js';

const OccupiedRoomsList = () => {
  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const [occupiedRooms, setOccupiedRooms] = useState([]);

  useEffect(() => {
    const getOccupiedRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/rooms/assignments`);

        const expanded = res.data.flatMap(
          ({
            timeStart,
            timeEnd,
            professor,
            floor,
            room,
            building,
            _id,
            date,
            year,
            subject,
            section,
            assignedBy,
          }) =>
            getTimeRange(timeStart, timeEnd).map((slot) => ({
              _id,
              slot,
              professor,
              floor,
              room,
              building,
              timeStart,
              timeEnd,
              date,
              year,
              subject,
              section,
              assignedBy,
            })),
        );

        setOccupiedRooms(expanded);
        console.log('Fetched Occupied Rooms:', expanded);
      } catch (error) {
        console.error('Error fetching occupied rooms:', error);
      }
    };

    getOccupiedRooms();
  }, []);

  // Get all time slots between start and end (inclusive)
  const getTimeRange = (start, end) => {
    const slots = generateTimeSlots();
    const startIndex = slots.indexOf(start);
    const endIndex = slots.indexOf(end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex)
      return [];

    return slots.slice(startIndex, endIndex + 1); // ✅ this was missing
  };

  const groupedByProfessor = occupiedRooms.reduce((acc, entry) => {
    const profId = entry.professor?._id;
    if (!acc[profId]) {
      acc[profId] = {
        professor: entry.professor,
        slots: [],
      };
    }
    acc[profId].slots.push(entry);
    return acc;
  }, {});

  console.log('Grouped by Professor:', groupedByProfessor);

  const colors = colorPalette;

  // Assign a consistent color to each unique name using a cache
  const getColorClass = (() => {
    const cache = {};
    return (name) => {
      if (!cache[name]) {
        const index = Object.keys(cache).length % colors.length;
        cache[name] = colors[index];
      }
      return cache[name];
    };
  })();

  // Get all time slots between start and end (inclusive)

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, '0');
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const uniqueProfessors = Array.from(
    new Set(occupiedRooms.map((entry) => entry.professor)),
  );

  const loggedInDean = localStorage.getItem('loggedInDean');

  console.log('Occupied Rooms Data:', occupiedRooms);
  return (
    <div className='max-w-3xl mx-auto space-y-2 mt-10'>
      {/* 🧭 Legend: Unique Professors */}
      <div className='mb-4 flex flex-wrap gap-4 items-center'>
        {Array.from(
          new Map(
            uniqueProfessors
              .filter((prof) => prof && prof.fullName)
              .map((prof) => [prof.fullName, prof]),
          ).values(),
        ).map((prof) => {
          const { bg } = getColorClass(prof.fullName);
          return (
            <div
              key={prof._id}
              className='flex items-center gap-2'>
              <div className={`w-4 h-4 rounded ${bg}`}></div>
              <span className='text-sm font-medium text-base-content'>
                {prof.fullName || 'Unknown'}
              </span>
            </div>
          );
        })}
      </div>

      {/* 📚 Grouped Slot Display by Professor → Weekday */}
      {Object.entries(groupedByProfessor).map(([profId, group]) => {
        const professor = group?.professor;
        const slots = Array.isArray(group?.slots) ? group.slots : [];

        const name = professor?.fullName || 'Unknown';
        const { border } = getColorClass(name);

        const uniqueSlots = slots
          .filter((slot, index, self) => {
            return (
              self.findIndex(
                (s) =>
                  s.timeStart === slot.timeStart &&
                  s.timeEnd === slot.timeEnd &&
                  s.date === slot.date &&
                  s.professor?._id === slot.professor?._id,
              ) === index
            );
          })
          .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.timeStart}`);
            const timeB = new Date(`1970-01-01T${b.timeStart}`);
            return timeA - timeB;
          });

        // 🗓️ Group slots by weekday
        const slotsByWeekday = uniqueSlots.reduce((acc, slot) => {
          const weekday = new Date(slot.date).toLocaleDateString('en-US', {
            weekday: 'long',
          });
          if (!acc[weekday]) acc[weekday] = [];
          acc[weekday].push(slot);
          return acc;
        }, {});

        // 📅 Sort weekdays Monday → Sunday
        const weekdayOrder = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const sortedWeekdays = weekdayOrder.filter(
          (day) => slotsByWeekday[day],
        );

        return (
          <div
            key={profId}
            className={`border-2 rounded p-4 bg-neutral text-neutral-content h-[400px] overflow-y-auto ${border}`}>
            <div className='mb-2 text-md font-bold'>{name}</div>

            {/* 🔄 Render slots grouped by weekday */}
            {sortedWeekdays.map((weekday) => (
              <div key={weekday}>
                <div className='text-sm font-semibold mt-4 mb-2 underline'>
                  {weekday}
                </div>
                <div className='space-y-2'>
                  {slotsByWeekday[weekday].map((slot, index) => (
                    <div
                      key={slot._id || index}
                      className='bg-base-200 rounded-md p-2 text-sm text-base-content flex justify-between items-center'>
                      <div className='text-sm text-base-content space-y-1'>
                        <div>
                          <span>
                            {new Date(
                              `1970-01-01T${slot.timeStart}`,
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}{' '}
                            –{' '}
                            {new Date(
                              `1970-01-01T${slot.timeEnd}`,
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>{' '}
                          on{' '}
                          {new Date(slot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div>
                          <strong>{slot.building}</strong>, Floor{' '}
                          <strong>{slot.floor}</strong>, Room{' '}
                          <strong>{slot.room}</strong>
                        </div>
                        <div>
                          <strong>{slot.year}</strong> |{' '}
                          <strong>{slot.subject}</strong> |{' '}
                          <strong>{slot.section}</strong>
                        </div>
                      </div>
                      {loggedInDean === slot.assignedBy ? (
                        <div className='flex gap-2 mt-3'>
                          <UpdateSchedule
                            prevSelectedFloor={slot.floor}
                            prevSelectedRoom={slot.room}
                            selectedDate={slot.date}
                            selectedDean={slot.assignedBy}
                            prevSelectedYear={slot.year}
                            prevSelectedSubject={slot.subject}
                            prevSelectedSection={slot.section}
                            prevSelectedBuilding={slot.building}
                            buildingData={buildingData}
                            prevSelectedProff={
                              slot.professor?.fullName || 'Unknown'
                            }
                            scheduledID={slot._id}
                            slotData={slot}
                            timeEnd={slot.timeEnd}
                            timeStart={slot.timeStart}
                            timeSlots={timeSlots}
                            occupiedTimes={occupiedRooms}
                            onSetOccupiedTimes={setOccupiedRooms}
                            subjectsByYear={subjectsByYear}
                            sections={sections}
                          />
                          <DelSchedule
                            scheduledID={slot._id}
                            assignedProf={slot.professor.fullName}
                            onSetOccupiedTimes={setOccupiedRooms}
                          />
                        </div>
                      ) : (
                        <span>
                          Assigned by: <strong>{slot.assignedBy}</strong>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default OccupiedRoomsList;
