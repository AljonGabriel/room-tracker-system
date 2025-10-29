import buildingData from '../data/buildingData';
import colorPalette from '../data/colorPalette.js';
import sections from '../data/sections.js';
import subjectsByYear from '../data/subjectsByYear.js';

import axios from 'axios';
import toast from 'react-hot-toast';
import OccupiedTimeLogs from './OccupiedTimeLogs.jsx';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AssigningRoom = () => {
  const isLocal = window.location.hostname === 'localhost';

  const API_BASE = isLocal
    ? 'http://localhost:5001' // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend
  const location = useLocation();
  const selectedDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : null;

  // Fetch state
  const [instructorList, setInstructorList] = useState([]);

  // Form state

  const [selectedDean, setSelectedDean] = useState(() => {
    return localStorage.getItem('loggedInDean') || '';
  });
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [occupiedTimes, setOccupiedTimes] = useState([]);

  //conditional
  const [isRepeating, setIsRepeating] = useState('No');

  useEffect(() => {
    const controller = new AbortController();

    const fetchOccupiedTimes = async () => {
      try {
        if (!selectedDate) {
          console.warn('⚠️ Missing selectedDate or selectedRoom');
          navigate('/');
          return;
        }

        const dateStr = selectedDate.toLocaleDateString('en-CA'); // → "2025-09-01"

        const res = await axios.get(
          `${API_BASE}/api/rooms/assignments/by-date`,
          {
            params: {
              room: selectedRoom,
              date: dateStr,
            },
            signal: controller.signal,
          },
        );

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

        setOccupiedTimes(expanded);
        console.log('Fetched occupied times for room:', selectedRoom, expanded);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('⏹️ Request canceled due to component update');
        } else {
          console.error('❌ Failed to fetch occupied times', err);
        }
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/employees/getemp`);
        const allEmployees = res.data;

        const instructors = allEmployees
          .filter((emp) => emp.role === 'Instructor')
          .map((emp) => ({ id: emp._id, fullName: emp.fullName }));

        setInstructorList(instructors); // ✅ Add this state if needed
      } catch (error) {
        console.error('❌ Failed to fetch employees', error);

        setInstructorList([]);
      }
    };

    fetchEmployees();
    fetchOccupiedTimes();

    return () => {
      controller.abort(); // ✅ cancel request if room changes quickly
    };
  }, [selectedRoom]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, '0');
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  // Get all time slots between start and end (inclusive)
  const getTimeRange = (start, end) => {
    const slots = generateTimeSlots();
    const startIndex = slots.indexOf(start);
    const endIndex = slots.indexOf(end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex)
      return [];

    return slots.slice(startIndex, endIndex + 1); // ✅ this was missing
  };

  const resetForm = () => {
    setSelectedProfessor('');
    setSelectedYear('');
    setSelectedSubject('');
    setSelectedSection('');
    setSelectedBuilding('');
    setSelectedFloor('');
    setSelectedRoom('');
    setStartTime('');
    setEndTime('');
    setOccupiedTimes([]);
  };

  // Derived values
  const buildings = Object.keys(buildingData);
  const floors = selectedBuilding
    ? Object.keys(buildingData[selectedBuilding])
    : [];
  const rooms = selectedFloor
    ? buildingData[selectedBuilding][selectedFloor]
    : [];
  const timeSlots = generateTimeSlots();

  const navigate = useNavigate();

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

  const groupedByProfessor = occupiedTimes.reduce((acc, entry) => {
    const profId = entry.professor._id;
    if (!acc[profId]) {
      acc[profId] = {
        professor: entry.professor,
        slots: [],
      };
    }
    acc[profId].slots.push(entry);
    return acc;
  }, {});

  const uniqueProfessors = Array.from(
    new Set(occupiedTimes.map((entry) => entry.professor)),
  );

  // Year and subject toggle
  const subjectOptions = selectedYear ? subjectsByYear[selectedYear] : [];

  // Submit assignment to backend
  const handleAssignRoom = async () => {
    const dateStr = selectedDate.toLocaleDateString('en-CA'); // → "2025-09-02"
    const repeating = isRepeating === 'Yes'; // dropdown value

    const basePayload = {
      year: selectedYear,
      subject: selectedSubject,
      section: selectedSection,
      building: selectedBuilding,
      floor: parseInt(selectedFloor, 10),
      room: selectedRoom,
      timeStart: startTime,
      timeEnd: endTime,
      professor: selectedProfessor,
      assignedBy: selectedDean,
      repeating,
    };
    console.log('Instructors:', instructorList);
    try {
      if (repeating) {
        const weekday = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ...
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const recurringDates = [];

        for (let day = 1; day <= totalDays; day++) {
          const current = new Date(year, month, day);
          if (current.getDay() === weekday) {
            recurringDates.push(current.toLocaleDateString('en-CA'));
          }
        }

        for (const date of recurringDates) {
          await axios.post(`${API_BASE}/api/rooms/assignments/`, {
            ...basePayload,
            date,
          });
        }

        toast.success('✅ Repeating schedule assigned!');
      } else {
        await axios.post(`${API_BASE}/api/rooms/assignments/`, {
          ...basePayload,
          date: dateStr,
        });

        toast.success('✅ Room successfully assigned!');
      }

      resetForm();
    } catch (err) {
      console.error('Error assigning room:', err);
      alert('❌ Failed to assign room. Please try again.');
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-6 bg-base-200 rounded-lg shadow-md space-y-6 mt-5'>
      <h2 className='text-xl font-bold text-center'>📝 Assign a Room</h2>

      {/* Selected Date Display */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>Selected Date:</label>
        {selectedDate && (
          <input
            type='text'
            className='input input-bordered flex-1 bg-base-300 text-center font-semibold'
            value={selectedDate.toDateString()}
            readOnly
          />
        )}
        <button
          className='btn btn-warning btn-outline btn-info whitespace-nowrap'
          onClick={() => {
            localStorage.removeItem('selectedDate');
            toast.success('Please choose a new date.');

            // Delay navigation slightly to allow toast to render
            setTimeout(() => {
              navigate('/home');
            }, 200); // 500ms is usually enough
          }}>
          Change Date
        </button>
        {/* Action Button */}
        <div className='flex'>
          <button
            className='btn btn-outline btn-accent'
            onClick={() => {
              navigate('/employees');
            }}>
            Manage Employee
          </button>
        </div>
      </div>

      {/* Dean Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>Dean Assigned:</label>
        <select
          className='select select-bordered flex-1 bg-base-200 cursor-not-allowed'
          value={selectedDean}
          disabled>
          <option value={selectedDean}>{selectedDean}</option>
        </select>
      </div>

      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>Who will teach ?</label>
        <select
          className='select select-bordered flex-1'
          value={selectedProfessor}
          onChange={(e) => setSelectedProfessor(e.target.value)}>
          <option
            disabled
            value=''>
            ...
          </option>
          {instructorList.map((prof) => (
            <option
              key={prof.id}
              value={prof.id}>
              {prof.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Year Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>What year level ?</label>

        <select
          className='select select-bordered flex-1'
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedSubject(''); // reset subject
          }}>
          <option
            disabled
            value=''>
            ...
          </option>
          {Object.keys(subjectsByYear).map((year) => (
            <option
              key={year}
              value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>Select Course Code</label>
        <select
          className='select select-bordered flex-1'
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          disabled={!selectedYear}>
          <option
            disabled
            value=''>
            ...
          </option>
          {subjectOptions.map((subj) => (
            <option
              key={subj}
              value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      {/* Sections Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>What Section ?</label>
        <select
          className='select select-bordered flex-1'
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}>
          <option
            disabled
            value=''>
            ...
          </option>
          {sections.map((sec) => (
            <option
              key={sec}
              value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      {/* Building Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>What Building ?</label>
        <select
          className='select select-bordered flex-1'
          value={selectedBuilding}
          onChange={(e) => {
            setSelectedBuilding(e.target.value);
            setSelectedFloor('');
            setSelectedRoom('');
            setStartTime('');
            setEndTime('');
          }}>
          <option
            disabled
            value=''>
            ...
          </option>
          {buildings.map((b) => (
            <option
              key={b}
              value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Floor Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='font-medium w-32'>What floor ?</label>
        <select
          className='select select-bordered flex-1'
          value={selectedFloor}
          onChange={(e) => {
            setSelectedFloor(e.target.value); // still stores as string
            setSelectedRoom('');
            setStartTime('');
            setEndTime('');
          }}>
          <option
            disabled
            value=''>
            ...
          </option>
          {floors.map((f) => {
            const floorNum = parseInt(f.replace(/\D/g, ''));
            return (
              <option
                key={f}
                value={floorNum}>
                {floorNum}
              </option>
            );
          })}
        </select>
      </div>

      <div className='flex items-center gap-4'>
        <label className='text-sm font-medium min-w-[200px]'>
          Repeat this schedule weekly?
        </label>

        <select
          className='select select-bordered w-full max-w-xs'
          value={isRepeating}
          onChange={(e) => setIsRepeating(e.target.value)}>
          <option value='No'>No</option>
          <option value='Yes'>Yes</option>
        </select>
      </div>

      {/* Room Grid */}
      {rooms.length > 0 && (
        <div>
          <h3 className='text-md font-semibold mb-2 text-center'>
            What Room ?
          </h3>
          <div className='grid grid-cols-5 gap-3'>
            {rooms.map((room) => (
              <button
                key={room}
                type='button'
                className={`btn btn-sm w-full ${
                  selectedRoom === room ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setSelectedRoom(room)}>
                {room}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Range Selection */}
      {selectedRoom && (
        <>
          {/* Start Time Dropdown */}
          <div className='flex items-center gap-4'>
            <label className='font-medium w-32'>Class starts at:</label>
            <select
              className='select select-bordered flex-1'
              value={startTime}
              onChange={(e) => {
                const selectedStart = e.target.value;
                const selectedDateStr =
                  selectedDate.toLocaleDateString('en-CA');

                // Filter entries for same room and date
                const sameDayEntries = occupiedTimes.filter((entry) => {
                  const entryDateStr = new Date(entry.date).toLocaleDateString(
                    'en-CA',
                  );
                  return entryDateStr === selectedDateStr;
                });

                // Check if selectedStart is inside any occupied range (excluding exact end match)
                const isInsideOccupiedRange = sameDayEntries.some(
                  (entry) =>
                    selectedStart >= entry.timeStart &&
                    selectedStart < entry.timeEnd &&
                    selectedStart !== entry.timeEnd,
                );

                if (isInsideOccupiedRange) {
                  toast.error(
                    `${selectedStart} overlaps with an existing booking in Room ${selectedRoom}.`,
                  );
                  return;
                }

                // Find current booking ID (if editing an existing entry)
                const matchingEntry = sameDayEntries.find(
                  (entry) =>
                    entry.timeStart === selectedStart &&
                    entry.timeEnd === endTime,
                );
                const selectedBookingId = matchingEntry?._id;

                // Check for duplicate start time (excluding current booking)
                const isStartTimeAlreadyTaken = sameDayEntries.some(
                  (entry) =>
                    entry.timeStart === selectedStart &&
                    entry._id !== selectedBookingId,
                );

                if (isStartTimeAlreadyTaken) {
                  toast.error(
                    `${selectedStart} is already used by another booking in Room ${selectedRoom}.`,
                  );
                  setStartTime('');
                  return;
                }

                // All good — set the selected start time
                setStartTime(selectedStart);
              }}>
              <option
                disabled
                value=''>
                Start:
              </option>
              {timeSlots.map((slot) => {
                const conflict = occupiedTimes.find(
                  (entry) => entry.slot === slot,
                );
                const nextConflict = occupiedTimes.find(
                  (entry) =>
                    entry.timeStart === conflict?.timeEnd &&
                    entry.room === selectedRoom,
                );
                const isOccupied = !!conflict;

                let label = `${slot}`;
                if (isOccupied) {
                  label += ` ${conflict.professor?.fullName || 'Unknown'} • ${
                    conflict.room
                  } • ${conflict.building}`;
                  if (nextConflict) {
                    label += ` → Next: ${
                      nextConflict.professor?.fullName || 'Unknown'
                    } (${nextConflict.timeStart}–${nextConflict.timeEnd})`;
                  }
                  label += '.';
                }

                return (
                  <option
                    key={slot}
                    value={slot}
                    className={`text-sm ${
                      isOccupied
                        ? 'bg-neutral text-neutral-content font-semibold'
                        : 'text-base-content'
                    }`}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* End Time Dropdown */}
          <div className='flex items-center gap-4'>
            <label className='font-medium w-32'>Class ends at:</label>
            <select
              className='select select-bordered flex-1'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}>
              <option
                disabled
                value=''>
                Select End
              </option>
              {timeSlots.map((slot) => {
                const conflict = occupiedTimes.find(
                  (entry) => entry.slot === slot,
                );
                const isOccupied = !!conflict;

                let label = slot;
                if (isOccupied && conflict) {
                  label += ` ${conflict.professor?.fullName || 'Unknown'} • ${
                    conflict.room
                  } • ${conflict.building}`;
                }

                const isSameAsStart = slot === startTime;

                return (
                  <option
                    key={slot}
                    value={slot}
                    disabled={isOccupied || isSameAsStart}
                    className={
                      isOccupied
                        ? 'bg-neutral text-neutral-content text-sm'
                        : isSameAsStart
                        ? 'bg-green-500 text-white font-semibold'
                        : 'text-sm text-base-content'
                    }>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      )}
      <OccupiedTimeLogs
        groupedByProfessor={groupedByProfessor}
        uniqueProfessors={uniqueProfessors}
        getColorClass={getColorClass}
        selectedDean={selectedDean}
        timeSlots={timeSlots}
        occupiedTimes={occupiedTimes}
        onSetOccupiedTimes={setOccupiedTimes}
        selectedDate={selectedDate}
        subjectsByYear={subjectsByYear}
        sections={sections}
        onResetForm={resetForm}
      />

      {/* Summary Display */}
      {selectedDean &&
        selectedProfessor &&
        selectedRoom &&
        startTime &&
        endTime &&
        selectedDate && (
          <div className='text-center text-success mt-4'>
            ✅ Assigned by <strong>{selectedDean}</strong> to{' '}
            <strong>{selectedProfessor}</strong>
            <br />
            Room <strong>{selectedRoom}</strong> in{' '}
            <strong>{selectedBuilding}</strong>,{' '}
            <strong>{selectedFloor}</strong>
            <br />
            Date: <strong>{selectedDate.toDateString()}</strong>
            <br />
            Time Range: <strong>{startTime}</strong> to{' '}
            <strong>{endTime}</strong>
          </div>
        )}

      {/* Confirm Assignment Button */}
      {selectedDean &&
        selectedProfessor &&
        selectedRoom &&
        startTime &&
        endTime &&
        selectedDate && (
          <div className='text-center mt-4'>
            <button
              className='btn btn-success'
              onClick={handleAssignRoom}>
              Confirm schedule
            </button>
          </div>
        )}
    </div>
  );
};

export default AssigningRoom;
