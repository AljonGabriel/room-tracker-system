import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UpdateSchedule = ({
  prevSelectedFloor,
  prevSelectedRoom,
  selectedDate,
  prevSelectedYear,
  prevSelectedSubject,
  prevSelectedSection,
  prevSelectedBuilding,
  buildingData,
  prevSelectedProff,
  selectedDean,
  scheduledID,
  timeEnd,
  timeStart,
  timeSlots,
  occupiedTimes,
  onSetOccupiedTimes,
  onResetForm,
  subjectsByYear,
  sections,
}) => {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [updateSelectedYear, setUpdateSelectedYear] = useState('');
  const [updateSelectedSubject, setUpdateSelectedSubject] = useState('');
  const [updateSelectedSection, setUpdateSelectedSection] = useState('');

  const [updateSelectedBuilding, setUpdateSelectedBuilding] = useState('');
  const [updateSelectedFloor, setUpdateSelectedFloor] = useState('');
  const [updateSelectedRoom, setUpdateSelectedRoom] = useState('');
  const [updateStartTime, setUpdateStartTime] = useState('');
  const [updateEndTime, setUpdateEndTime] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildings = Object.keys(buildingData);
  const floors = updateSelectedBuilding
    ? Object.keys(buildingData[updateSelectedBuilding])
    : [];

  const rooms = updateSelectedFloor
    ? buildingData[updateSelectedBuilding][updateSelectedFloor]
    : [];

  // Year and subject toggle
  const subjectOptions = updateSelectedYear
    ? subjectsByYear[updateSelectedYear]
    : [];

  const resetForms = () => {
    setUpdateSelectedYear('');
    setUpdateSelectedSection('');
    setUpdateSelectedSubject('');
    setUpdateSelectedBuilding('');
    setUpdateSelectedFloor('');
    setUpdateSelectedRoom('');
    setUpdateStartTime('');
    setUpdateEndTime('');
  };

  console.log('Occupiedtimes updatemodal:', occupiedTimes);

  const handleCancelUpdate = () => {
    resetForms();
    const modal = document.getElementById(`update-modal-${scheduledID}`);
    if (modal) modal.checked = false;
  };

  const handleScheduleUpdate = async ({
    e,
    scheduledID,
    occupiedTimes,
    onSetOccupiedTimes,
    prevSelectedProff,
    updateStartTime,
    updateEndTime,
    updateSelectedYear,
    updateSelectedSection,
    updateSelectedSubject,
    updateSelectedBuilding,
    updateSelectedFloor,
    updateSelectedRoom,
    timeStart,
    timeEnd,
    prevSelectedYear,
    prevSelectedSection,
    prevSelectedSubject,
    prevSelectedBuilding,
    prevSelectedFloor,
    prevSelectedRoom,
    selectedDean,
    selectedDate,
  }) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error('❌ No date selected.');
      return;
    }

    const dateStr = new Date(selectedDate).toLocaleDateString('en-CA');

    // ✅ Conflict check
    const hasConflictWithOthers = occupiedTimes.some((entry) => {
      if (entry._id === scheduledID) return false;

      return (
        entry.professor !== prevSelectedProff &&
        updateStartTime < entry.timeEnd &&
        updateEndTime > entry.timeStart
      );
    });

    console.log('hasconflictwithother updatemodal: ', hasConflictWithOthers);

    if (hasConflictWithOthers) {
      toast.error(
        'Selected time range overlaps with another Instructor schedule.',
      );
      return;
    }

    // ✅ Prepare payload
    const payload = {
      year: updateSelectedYear || prevSelectedYear,
      section: updateSelectedSection || prevSelectedSection,
      subject: updateSelectedSubject || prevSelectedSubject,
      building: updateSelectedBuilding || prevSelectedBuilding,
      floor: updateSelectedFloor || prevSelectedFloor,
      room: updateSelectedRoom || prevSelectedRoom,
      timeStart: updateStartTime || timeStart,
      timeEnd: updateEndTime || timeEnd,
      date: dateStr,
      assignedBy: selectedDean,
    };

    try {
      await axios.put(
        `${API_BASE}/api/rooms/assignments/${scheduledID}`,
        payload,
      );

      const updatedRecord = {
        ...payload,
        _id: scheduledID,
        slot: `${payload.timeStart}–${payload.timeEnd}`,
        professor: occupiedTimes.find((entry) => entry._id === scheduledID)
          ?.professor,
      };

      // ✅ Update occupiedTimes directly
      onSetOccupiedTimes((prev) =>
        prev.map((entry) =>
          entry._id === scheduledID ? updatedRecord : entry,
        ),
      );

      resetForms();

      toast.success('✅ Schedule updated successfully!');
      document.getElementById(`update-modal-${scheduledID}`).checked = false;
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('❌ Failed to update schedule. Please try again.');
    }
    resetForms();
  };
  console.log('🛠️ Editing scheduledID:', scheduledID);
  console.log('🛠️ Editing selectedDate:', selectedDate);

  return (
    <>
      <button
        className='btn btn-sm btn-accent'
        onClick={() => {
          document.getElementById(`update-modal-${scheduledID}`).checked = true;
        }}>
        Edit
      </button>

      {/* Modal */}
      <input
        type='checkbox'
        id={`update-modal-${scheduledID}`}
        className='modal-toggle'
      />

      <div className='modal'>
        <div className='modal-box px-8 py-6 max-w-4xl w-full'>
          <form
            onSubmit={(e) =>
              handleScheduleUpdate({
                e,
                scheduledID,
                occupiedTimes,
                onSetOccupiedTimes,
                prevSelectedProff,
                updateStartTime,
                updateEndTime,
                updateSelectedYear,
                updateSelectedSection,
                updateSelectedSubject,
                updateSelectedBuilding,
                updateSelectedFloor,
                updateSelectedRoom,
                timeStart,
                timeEnd,
                prevSelectedYear,
                prevSelectedSection,
                prevSelectedSubject,
                prevSelectedBuilding,
                prevSelectedFloor,
                prevSelectedRoom,
                selectedDean,
                selectedDate,
              })
            }>
            <div className='grid grid-cols-1 gap-6 mb-6'>
              {/* Dean Assigned */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  {scheduledID}
                </label>
                <label className='block text-sm font-medium text-base-content'>
                  {prevSelectedProff}
                </label>
                <label className='block text-sm font-medium text-base-content'>
                  Dean Assigned
                </label>
                <input
                  type='text'
                  className='input input-bordered w-full bg-base-300 text-center font-semibold'
                  value={selectedDean}
                  readOnly
                  disabled
                />
              </div>

              {/* Year Selection */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  Year
                </label>
                <select
                  name='building'
                  className='select select-bordered w-full'
                  value={updateSelectedYear}
                  onChange={(e) => {
                    setUpdateSelectedYear(e.target.value);
                  }}
                  disabled={!selectedDean}>
                  <option
                    disabled
                    value=''>
                    Select Year Level
                  </option>
                  {Object.keys(subjectsByYear).map((year) => (
                    <option
                      key={year}
                      value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className='text-xs text-gray-500 italic'>
                  Previous:{' '}
                  <span className='font-semibold text-gray-700'>
                    {prevSelectedYear}
                  </span>
                </div>
              </div>

              {updateSelectedYear && (
                <div className='space-y-2'>
                  {/* Subject Selection */}
                  <label className='block text-sm font-medium text-base-content'>
                    Subject
                  </label>
                  <select
                    name='building'
                    className='select select-bordered w-full'
                    value={updateSelectedSubject}
                    onChange={(e) => {
                      setUpdateSelectedSubject(e.target.value);
                    }}
                    disabled={!updateSelectedYear}
                    required>
                    <option
                      disabled
                      value=''>
                      Select Subject
                    </option>
                    {subjectOptions.map((subj) => (
                      <option
                        key={subj}
                        value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  <div className='text-xs text-gray-500 italic'>
                    Previous:{' '}
                    <span className='font-semibold text-gray-700'>
                      {prevSelectedSubject}
                    </span>
                  </div>
                </div>
              )}

              {/* Section Selection */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  Section
                </label>
                <select
                  name='building'
                  className='select select-bordered w-full'
                  value={updateSelectedSection}
                  onChange={(e) => {
                    setUpdateSelectedSection(e.target.value);
                  }}>
                  <option
                    disabled
                    value=''>
                    Select Section
                  </option>
                  {sections.map((sec) => (
                    <option
                      key={sec}
                      value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                <div className='text-xs text-gray-500 italic'>
                  Previous:{' '}
                  <span className='font-semibold text-gray-700'>
                    {prevSelectedSection}
                  </span>
                </div>
              </div>

              {/* Building Selection */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  Building
                </label>
                <select
                  name='building'
                  className='select select-bordered w-full'
                  value={updateSelectedBuilding}
                  onChange={(e) => {
                    setUpdateSelectedBuilding(e.target.value);
                    setUpdateSelectedFloor('');
                  }}>
                  <option
                    disabled
                    value=''>
                    Select Building
                  </option>
                  {buildings.map((b) => (
                    <option
                      key={b}
                      value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {/* Previous Data Display */}
                <div className='text-xs text-gray-500 italic'>
                  Previous:{' '}
                  <span className='font-semibold text-gray-700'>
                    {prevSelectedBuilding}
                  </span>
                </div>
              </div>

              {updateSelectedBuilding && (
                <div className='space-y-2'>
                  {/* Floor Selection */}
                  <label className='block text-sm font-medium text-base-content'>
                    Floor
                  </label>
                  <select
                    name='floor'
                    className='select select-bordered w-full'
                    value={updateSelectedFloor}
                    onChange={(e) => {
                      setUpdateSelectedFloor(e.target.value);
                      setUpdateSelectedRoom('');
                      setUpdateStartTime('');
                      setUpdateEndTime('');
                    }}
                    required>
                    <option
                      disabled
                      value=''>
                      Select Level
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
                  {/* Previous Data Display */}
                  <div className='text-xs text-gray-500 italic'>
                    Previous:{' '}
                    <span className='font-semibold text-gray-700'>
                      {prevSelectedFloor}
                    </span>
                  </div>

                  {/* Room Selection */}
                  {rooms.length > 0 && (
                    <div className='mb-6'>
                      <label className='block text-sm font-medium text-base-content mb-2'>
                        Select a Room
                      </label>
                      <select
                        name='room'
                        className='select select-bordered w-full'
                        value={updateSelectedRoom}
                        onChange={(e) => setUpdateSelectedRoom(e.target.value)}
                        required>
                        <option
                          disabled
                          value=''>
                          Select Room
                        </option>
                        {rooms.map((room) => (
                          <option
                            key={room}
                            value={room}>
                            {room}
                          </option>
                        ))}
                      </select>
                      <div className='text-xs text-gray-500 italic mt-1'>
                        Previous:{' '}
                        <span className='font-semibold text-gray-700'>
                          {prevSelectedRoom}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Time Selection */}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              {/* Start Time */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  Class starts at:
                </label>
                <select
                  className='select select-bordered w-full'
                  value={updateStartTime}
                  onChange={(e) => {
                    const selectedStart = e.target.value;
                    const selectedDateStr = new Date(
                      selectedDate,
                    ).toLocaleDateString('en-CA');

                    // Filter entries for same room and date
                    const sameDayEntries = occupiedTimes.filter((entry) => {
                      const entryDateStr = new Date(
                        entry.date,
                      ).toLocaleDateString('en-CA');
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
                        `${selectedStart} overlaps with an existing booking in Room ${prevSelectedRoom}.`,
                      );
                      return;
                    }

                    // Find current booking ID (if editing an existing entry)
                    const matchingEntry = sameDayEntries.find(
                      (entry) =>
                        entry.timeStart === updateStartTime &&
                        entry.timeEnd === updateEndTime,
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
                        `${selectedStart} is already used by another booking in Room ${prevSelectedRoom}.`,
                      );
                      setUpdateStartTime('');
                      return;
                    }

                    // All good — set the selected start time
                    setUpdateStartTime(selectedStart);
                  }}>
                  <option
                    disabled
                    value=''>
                    Select Start
                  </option>
                  {timeSlots.map((slot) => {
                    const conflict = occupiedTimes.find(
                      (entry) => entry.slot === slot,
                    );
                    const nextConflict = occupiedTimes.find(
                      (entry) =>
                        entry.timeStart === conflict?.timeEnd &&
                        entry.room === updateSelectedRoom,
                    );
                    const isOccupied = !!conflict;

                    let label = `${slot}`;
                    if (isOccupied) {
                      label += ` ${
                        conflict.professor?.fullName || 'Unknown'
                      } • ${conflict.room} • ${conflict.building}`;
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

              {/* End Time */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-base-content'>
                  Class ends at:
                </label>
                <select
                  className='select select-bordered w-full'
                  value={updateEndTime}
                  onChange={(e) => setUpdateEndTime(e.target.value)}>
                  <option
                    disabled
                    value=''>
                    Select time
                  </option>
                  {timeSlots.map((slot) => {
                    const conflict = (occupiedTimes || []).find(
                      (entry) => entry.slot === slot,
                    );

                    const nextConflict =
                      conflict?.timeEnd &&
                      (occupiedTimes || []).find(
                        (entry) => entry.timeStart === conflict.timeEnd,
                      );

                    const isOccupied = !!conflict;
                    const isOwnedByCurrentProfessor =
                      conflict?.professor === prevSelectedProff;
                    const isOccupiedByOther =
                      isOccupied && !isOwnedByCurrentProfessor;

                    let label = `${slot}`;
                    if (isOccupied) {
                      label += ` — Instructor: ${conflict.professor?.fullName} in Room ${conflict.room}, Floor ${conflict.floor}, ${conflict.building}`;
                      if (nextConflict) {
                        label += ` — then ${nextConflict.professor} from ${nextConflict.timeStart} to ${nextConflict.timeEnd}`;
                      }
                      label += '.';
                    }

                    const isSameAsStart = slot === updateStartTime;

                    return (
                      <option
                        key={slot}
                        value={slot}
                        disabled={isOccupiedByOther || isSameAsStart}
                        className={`text-sm ${
                          isOwnedByCurrentProfessor || isSameAsStart
                            ? 'bg-green-500 text-white font-semibold'
                            : isOccupiedByOther
                            ? 'bg-neutral text-neutral-content font-semibold'
                            : 'text-base-content'
                        }`}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className='modal-action'>
              <button
                type='button'
                className='btn btn-outline'
                onClick={handleCancelUpdate}>
                Cancel
              </button>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateSchedule;
