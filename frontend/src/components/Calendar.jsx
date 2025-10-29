import React from 'react';

import { useState } from 'react';

const Calendar = ({ onDateSelect }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-indexed
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarCells = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isPastDate = (year, month, day) => {
    const today = new Date();
    const target = new Date(year, month, day);
    // Remove time component for clean comparison
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  const goToPreviousMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1, 1);
    setViewDate(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    setViewDate(next);
  };

  return (
    <div className='text-center my-6'>
      <h1 className='text-xl font-semibold mb-4'>Select date to assign room</h1>

      <div className='p-6 m-2 bg-base-200 rounded-lg shadow-md max-w-3xl mx-auto'>
        {/* Month Navigation */}
        <div className='flex justify-between items-center mb-4'>
          <button
            className='btn btn-sm btn-outline'
            onClick={goToPreviousMonth}>
            ◀ Previous
          </button>
          <h2 className='text-2xl font-bold'>
            📅 {monthName} {currentYear}
          </h2>
          <button
            className='btn btn-sm btn-outline'
            onClick={goToNextMonth}>
            Next ▶
          </button>
        </div>

        {/* Weekday labels */}
        <div className='grid grid-cols-7 gap-2 text-center text-sm font-semibold text-neutral-content'>
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className='py-2'>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className='grid grid-cols-7 gap-2 mt-2'>
          {calendarCells.map((day, index) => {
            if (!day) return <div key={index}></div>;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const cellDate = new Date(currentYear, currentMonth, day);
            cellDate.setHours(0, 0, 0, 0);

            const isPast = cellDate < today;

            return (
              <button
                key={index}
                className={`btn btn-sm ${
                  isPast
                    ? 'btn-disabled text-gray-400 bg-gray-200 cursor-not-allowed'
                    : 'btn-outline hover:btn-primary'
                }`}
                disabled={isPast}
                onClick={() => {
                  if (!isPast) {
                    onDateSelect(cellDate);
                  }
                }}>
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
