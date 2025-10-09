import axios from "axios";
import { useState } from "react";
import buildingData from "../data/buildingData";
import toast from "react-hot-toast";
import UpdateModal from "./UpdateModal";

const OccupiedTimeLogs = ({
  groupedByProfessor,
  uniqueProfessors,
  getColorClass,
  selectedDean,
  selectedDate,
  forceUpdate,
  occupiedTimes,
  timeSlots,
  subjectsByYear,
  sections,
}) => {
  const handleDeleteAll = async (professor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the schedule for ${professor}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/rooms/occupiedTime?professor=${encodeURIComponent(
          professor
        )}`
      );

      forceUpdate(); // Refresh data
      toast.success(`Successfully deleted the schedule for ${professor}`);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Bulk delete failed. Please try again.");
    }
  };

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the schedule for ${entry.professor} for the schedule of ${entry.timeStart} : ${entry.timeEnd}?`
    );
    console.log("entry", entry);
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/rooms/occupiedTime/${entry._id}`
      );
      toast.success(`Successfully deleted the schedule for ${entry.professor}`);
      forceUpdate(); // Refresh data
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Bulk delete failed. Please try again.");
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-md text-base-content my-3">
        Occupied Time Slots:
      </h4>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        {uniqueProfessors.map((name) => {
          const { bg } = getColorClass(name);
          return (
            <div key={name} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${bg}`}></div>
              <span className="text-sm font-medium text-base-content">
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grouped Slot Display */}
      <div className="mt-4 max-h-96 overflow-y-auto space-y-1">
        {Object.entries(groupedByProfessor).map(([professor, slots]) => {
          const { border } = getColorClass(professor);

          // Deduplicate by time range
          const uniqueSlots = slots.filter((slot, index, self) => {
            return (
              self.findIndex(
                (s) =>
                  s.timeStart === slot.timeStart &&
                  s.timeEnd === slot.timeEnd &&
                  s.professor === slot.professor
              ) === index
            );
          });

          console.log("Unique Slots:", uniqueSlots);

          return (
            <div
              key={professor}
              className={`border-2 rounded p-4 bg-neutral text-neutral-content ${border}`}
            >
              <div className="mb-2 text-md font-bold">{professor}</div>

              <div className="space-y-2">
                {uniqueSlots.map(
                  (
                    {
                      _id,
                      timeStart,
                      timeEnd,
                      room,
                      floor,
                      building,
                      date,
                      year,
                      subject,
                      section,
                    },
                    index
                  ) => (
                    <div
                      key={_id || index}
                      className="bg-base-200 rounded-md p-2 text-sm text-base-content flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold">{timeStart}</span> to{" "}
                        <span className="font-semibold">{timeEnd}</span> —{" "}
                        <span className="font-bold">Room:</span>{" "}
                        <span className="font-semibold">{room}</span>,{" "}
                        <span className="font-bold">Floor:</span>{" "}
                        <span className="font-semibold">{floor}</span>,{" "}
                        <span className="font-bold">Building:</span>{" "}
                        <span className="font-semibold">{building}</span>
                        <span className="font-bold">Date:</span>{" "}
                        <span className="font-semibold">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <UpdateModal
                          prevSelectedFloor={floor}
                          room={room}
                          selectedDate={selectedDate}
                          prevSelectedBuilding={building}
                          year={year}
                          subject={subject}
                          section={section}
                          buildingData={buildingData}
                          prevSelectedProff={professor}
                          selectedDean={selectedDean}
                          id={_id}
                          timeStart={timeStart}
                          timeEnd={timeEnd}
                          timeSlots={timeSlots}
                          occupiedTimes={occupiedTimes}
                          forceUpdate={forceUpdate}
                          subjectsByYear={subjectsByYear}
                          sections={sections}
                        />
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            handleDelete({
                              _id,
                              timeStart,
                              timeEnd,
                              room,
                              floor,
                              building,
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Group-Level Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDeleteAll(professor)}
                >
                  Delete all
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccupiedTimeLogs;
