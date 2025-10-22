import axios from "axios";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateModal = ({
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
  id,
  timeEnd,
  timeStart,
  timeSlots,
  occupiedTimes,
  forceUpdate,
  subjectsByYear,
  sections,
}) => {
  const [updateSelectedYear, setUpdateSelectedYear] = useState("");
  const [updateSelectedSubject, setUpdateSelectedSubject] = useState("");
  const [updateSelectedSection, setUpdateSelectedSection] = useState("");

  const [updateSelectedBuilding, setUpdateSelectedBuilding] = useState("");
  const [updateSelectedFloor, setUpdateSelectedFloor] = useState("");
  const [updateSelectedRoom, setUpdateSelectedRoom] = useState("");
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildings = Object.keys(buildingData);
  const floors = updateSelectedBuilding
    ? Object.keys(buildingData[updateSelectedBuilding])
    : [];

  const dateStr = selectedDate.toLocaleDateString("en-CA");

  const rooms = updateSelectedFloor
    ? buildingData[updateSelectedBuilding][updateSelectedFloor]
    : [];

  // Year and subject toggle
  const subjectOptions = updateSelectedYear
    ? subjectsByYear[updateSelectedYear]
    : [];

  const resetForms = () => {
    setUpdateSelectedYear("");
    setUpdateSelectedSection("");
    setUpdateSelectedSubject("");
    setUpdateSelectedBuilding("");
    setUpdateSelectedFloor("");
    setUpdateSelectedRoom("");
    setUpdateStartTime("");
    setUpdateEndTime("");
  };

  const handleCancelUpdate = () => {
    resetForms();
    const modal = document.getElementById(`update-modal-${prevSelectedProff}`);
    if (modal) modal.checked = false;
  };

  return (
    <>
      <button
        className="btn btn-sm btn-accent"
        onClick={() => {
          document.getElementById(
            `update-modal-${prevSelectedProff}`
          ).checked = true;
        }}
      >
        Edit
      </button>

      {/* Modal */}
      <input
        type="checkbox"
        id={`update-modal-${prevSelectedProff}`}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box px-8 py-6">
          <h3 className="text-2xl  text-primary text-center mb-6 border-b border-base-300 pb-3">
            Professor:{" "}
            <span className="text-secondary">{prevSelectedProff}</span>
            <span className="text-secondary">{id}</span>
          </h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              // Check for time conflicts with other professors
              const hasConflictWithOthers = occupiedTimes.some((entry) => {
                if (entry._id === id) return false;

                return (
                  entry.professor !== prevSelectedProff &&
                  updateStartTime < entry.timeEnd &&
                  updateEndTime > entry.timeStart
                );
              });

              if (hasConflictWithOthers) {
                toast.error(
                  "Selected time range overlaps with another Instructor schedule."
                );
                return;
              }

              // Prepare payload
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
              };

              try {
                const res = await axios.put(
                  `http://localhost:5001/api/rooms/${id}`,
                  payload
                );

                console.log("Update successful:", res.data);
                toast.success("✅ Schedule updated successfully!");
                document.getElementById(
                  `update-modal-${prevSelectedProff}`
                ).checked = false;
                forceUpdate();
                resetForms();
              } catch (error) {
                console.error("Update failed:", error);
                toast.error("❌ Failed to update schedule. Please try again.");
              }
            }}
          >
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Dean Assigned */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Dean Assigned
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-300 text-center font-semibold"
                  value={selectedDean}
                  readOnly
                  disabled
                />
              </div>

              {/* Year Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Year
                </label>
                <select
                  name="building"
                  className="select select-bordered w-full"
                  value={updateSelectedYear}
                  onChange={(e) => {
                    setUpdateSelectedYear(e.target.value);
                  }}
                  disabled={!selectedDean}
                >
                  <option disabled value="">
                    Select Year Level
                  </option>
                  {Object.keys(subjectsByYear).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 italic">
                  Previous:{" "}
                  <span className="font-semibold text-gray-700">
                    {prevSelectedYear}
                  </span>
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Subject
                </label>
                <select
                  name="building"
                  className="select select-bordered w-full"
                  value={updateSelectedSubject}
                  onChange={(e) => {
                    setUpdateSelectedSubject(e.target.value);
                  }}
                  disabled={!updateSelectedYear}
                >
                  <option disabled value="">
                    Select Subject
                  </option>
                  {subjectOptions.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 italic">
                  Previous:{" "}
                  <span className="font-semibold text-gray-700">
                    {prevSelectedSubject}
                  </span>
                </div>
              </div>

              {/* Section Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Section
                </label>
                <select
                  name="building"
                  className="select select-bordered w-full"
                  value={updateSelectedSection}
                  onChange={(e) => {
                    setUpdateSelectedSection(e.target.value);
                  }}
                >
                  <option disabled value="">
                    Select Section
                  </option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 italic">
                  Previous:{" "}
                  <span className="font-semibold text-gray-700">
                    {prevSelectedSection}
                  </span>
                </div>
              </div>

              {/* Building Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Building
                </label>
                <select
                  name="building"
                  className="select select-bordered w-full"
                  value={updateSelectedBuilding}
                  onChange={(e) => {
                    setUpdateSelectedBuilding(e.target.value);
                    setUpdateSelectedFloor("");
                  }}
                >
                  <option disabled value="">
                    Select Building
                  </option>
                  {buildings.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {/* Previous Data Display */}
                <div className="text-xs text-gray-500 italic">
                  Previous:{" "}
                  <span className="font-semibold text-gray-700">
                    {prevSelectedBuilding}
                  </span>
                </div>
              </div>

              {/* Floor Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Floor
                </label>
                <select
                  name="floor"
                  className="select select-bordered w-full"
                  value={updateSelectedFloor}
                  onChange={(e) => {
                    setUpdateSelectedFloor(e.target.value);
                    setUpdateSelectedRoom("");
                    setUpdateStartTime("");
                    setUpdateEndTime("");
                  }}
                >
                  <option disabled value="">
                    Select Level
                  </option>
                  {floors.map((f) => {
                    const floorNum = parseInt(f.replace(/\D/g, ""));
                    return (
                      <option key={f} value={floorNum}>
                        {floorNum}
                      </option>
                    );
                  })}
                </select>
                {/* Previous Data Display */}
                <div className="text-xs text-gray-500 italic">
                  Previous:{" "}
                  <span className="font-semibold text-gray-700">
                    {prevSelectedFloor}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Selection */}
            {rooms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3 text-center">
                  Select a Room
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {rooms.map((room) => (
                    <button
                      key={room}
                      type="button"
                      className={`btn btn-sm w-full ${
                        updateSelectedRoom === room
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                      onClick={() => setUpdateSelectedRoom(room)}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Selection */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Class starts at:
                </label>
                <select
                  className="select select-bordered w-full"
                  value={updateStartTime}
                  onChange={(e) => setUpdateStartTime(e.target.value)}
                >
                  <option disabled value="">
                    Select time
                  </option>
                  {timeSlots.map((slot) => {
                    const conflict = occupiedTimes.find(
                      (entry) => entry.slot === slot
                    );

                    console.log(conflict);

                    const nextConflict = occupiedTimes.find(
                      (entry) => entry.timeStart === conflict?.timeEnd
                    );

                    const isOccupied = !!conflict;
                    const isOwnedByCurrentProfessor =
                      conflict?.professor === prevSelectedProff;
                    const isOccupiedByOther =
                      isOccupied && !isOwnedByCurrentProfessor;

                    let label = `${slot}`;
                    if (isOccupied) {
                      label += ` — Instructor: ${conflict.professor.fullName} in Room ${conflict.room}, Floor ${conflict.floor}, ${conflict.building}`;
                      if (nextConflict) {
                        label += ` — then ${nextConflict.professor} from ${nextConflict.timeStart} to ${nextConflict.timeEnd}`;
                      }
                      label += ".";
                    }

                    return (
                      <option
                        key={slot}
                        value={slot}
                        disabled={isOccupiedByOther}
                        className={`text-sm ${
                          isOwnedByCurrentProfessor
                            ? "bg-green-500 text-white font-semibold"
                            : isOccupiedByOther
                            ? "bg-neutral text-neutral-content font-semibold"
                            : "text-base-content"
                        }`}
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content">
                  Class ends at:
                </label>
                <select
                  className="select select-bordered w-full"
                  value={updateEndTime}
                  onChange={(e) => setUpdateEndTime(e.target.value)}
                >
                  <option disabled value="">
                    Select time
                  </option>
                  {timeSlots.map((slot) => {
                    const conflict = occupiedTimes.find(
                      (entry) => entry.slot === slot
                    );
                    const nextConflict = occupiedTimes.find(
                      (entry) => entry.timeStart === conflict?.timeEnd
                    );

                    const isOccupied = !!conflict;
                    const isOwnedByCurrentProfessor =
                      conflict?.professor === prevSelectedProff;
                    const isOccupiedByOther =
                      isOccupied && !isOwnedByCurrentProfessor;

                    let label = `${slot}`;
                    if (isOccupied) {
                      label += ` — Instructor: ${conflict.professor} in Room ${conflict.room}, Floor ${conflict.floor}, ${conflict.building}`;
                      if (nextConflict) {
                        label += ` — then ${nextConflict.professor} from ${nextConflict.timeStart} to ${nextConflict.timeEnd}`;
                      }
                      label += ".";
                    }

                    return (
                      <option
                        key={slot}
                        value={slot}
                        disabled={isOccupiedByOther}
                        className={`text-sm ${
                          isOwnedByCurrentProfessor
                            ? "bg-green-500 text-white font-semibold"
                            : isOccupiedByOther
                            ? "bg-neutral text-neutral-content font-semibold"
                            : "text-base-content"
                        }`}
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelUpdate}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateModal;
