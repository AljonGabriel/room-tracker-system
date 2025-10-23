import React, { useState } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ message: '', type: 'info' });

  const handlePost = () => {
    if (!form.message.trim()) return;

    const newPost = {
      id: Date.now(),
      message: form.message,
      type: form.type,
      date: new Date().toISOString(),
    };

    setAnnouncements((prev) => [newPost, ...prev]);
    setForm({ message: '', type: 'info' });
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6 border border-base-300 rounded-lg p-6 bg-base-100 shadow-md'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-primary'>📢 Announcements</h2>
        <span className='badge badge-info badge-outline text-xs'>
          {announcements.length ? 'Live Updates' : 'Temporary Display'}
        </span>
      </div>

      {/* Description */}
      <div className='text-sm text-gray-600'>
        This section displays important updates, reminders, and notices for
        faculty and staff. You can use this space to highlight:
      </div>

      {/* Feed */}
      <div className='max-h-[200px] overflow-y-auto space-y-4'>
        {announcements.length ? (
          announcements.map((note) => (
            <div
              key={note.id}
              className='bg-base-200 rounded p-4 text-sm border-l-4 shadow-sm'
              style={{
                borderColor:
                  note.type === 'alert'
                    ? '#f87171'
                    : note.type === 'memo'
                    ? '#60a5fa'
                    : note.type === 'event'
                    ? '#fbbf24'
                    : '#34d399',
              }}>
              <span className='block text-gray-600'>{note.message}</span>
              <span className='text-xs text-gray-400'>
                📅 {new Date(note.date).toLocaleString()} •{' '}
                {note.type.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <div className='bg-base-200 rounded p-4 text-sm text-gray-500 italic'>
            🚧 No active announcements at the moment. This module is under
            development.
          </div>
        )}
      </div>

      {/* Post Form */}
      <div className='bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm space-y-3'>
        <textarea
          className='textarea textarea-bordered w-full resize-none'
          rows={2}
          placeholder='Quick update or reminder...'
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <div className='flex justify-between items-center'>
          <select
            className='select select-bordered'
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value='info'>Info</option>
            <option value='alert'>Alert</option>
            <option value='memo'>Memo</option>
            <option value='event'>Event</option>
          </select>
          <button
            className='btn btn-primary'
            onClick={handlePost}>
            ➕ Post Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
