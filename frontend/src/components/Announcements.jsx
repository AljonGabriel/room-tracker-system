import React from "react";

const Announcements = () => {
  return (
    <div className="border border-base-300 rounded-lg p-6 bg-base-100 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">📢 Announcements</h2>
        <span className="badge badge-info badge-outline text-xs">
          Temporary Display
        </span>
      </div>

      <div className="text-sm text-gray-600">
        This section will display important updates, reminders, and notices for
        faculty and staff. You can use this space to highlight:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Class cancellations or reschedules</li>
          <li>Room maintenance alerts</li>
          <li>Dean’s memos or policy changes</li>
          <li>Upcoming events or deadlines</li>
        </ul>
      </div>

      <div className="bg-base-200 rounded p-4 text-sm text-gray-500 italic">
        🚧 No active announcements at the moment. This module is under
        development.
      </div>

      <div className="flex justify-end">
        <button className="btn btn-sm btn-outline btn-primary">
          Manage Announcements
        </button>
      </div>
    </div>
  );
};

export default Announcements;
