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
  const loggedInDean = localStorage.getItem("loggedInDean");

  console.log("uniqueProfessors", uniqueProfessors);

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the schedule for ${
        entry.professor?.fullName || "Unknown"
      } from ${entry.timeStart} to ${entry.timeEnd}?`
    );
    console.log("entry", entry);
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/rooms/occupiedTime/${entry._id}`
      );
      toast.success(
        `Successfully deleted the schedule for ${
          entry.professor?.fullName || "Unknown"
        }`
      );
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
        {uniqueProfessors
          .filter((prof) => prof && prof.fullName)
          .map((prof) => {
            console.log("Legend professor:", prof); // ✅ logs each valid professor object

            const { bg } = getColorClass(prof.fullName);
            return (
              <div key={prof._id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${bg}`}></div>
                <span className="text-sm font-medium text-base-content">
                  <span>{prof.fullName || "Unknown"}</span>
                </span>
              </div>
            );
          })}
      </div>

      {/* Grouped Slot Display */}
      <div className="mt-4 max-h-96 overflow-y-auto space-y-1">
        {Object.entries(groupedByProfessor).map(([professorObj, slots]) => {
          const name =
            typeof professorObj === "object"
              ? professorObj.fullName
              : professorObj;
          const profId =
            typeof professorObj === "object" ? professorObj._id : professorObj;
          const { border } = getColorClass(name || "Unknown");

          // Deduplicate by time range
          const uniqueSlots = slots.filter((slot, index, self) => {
            return (
              self.findIndex(
                (s) =>
                  s.timeStart === slot.timeStart &&
                  s.timeEnd === slot.timeEnd &&
                  s.professor?._id === slot.professor?._id
              ) === index
            );
          });

          console.log("Unique Slots:", uniqueSlots);
          console.log("name.fullName:", profId); // ✅ shows "Prof John Doe"

          return (
            <div
              key={profId}
              className={`border-2 rounded p-4 bg-neutral text-neutral-content ${border}`}
            >
              <div className="mb-2 text-md font-bold">{name || "Unknown"}</div>

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
                      assignedBy,
                      professor,
                    },
                    index
                  ) => (
                    <div
                      key={_id || index}
                      className="bg-base-200 rounded-md p-2 text-sm text-base-content flex justify-between items-center"
                    >
                      <div className="text-sm">
                        <strong>{timeStart}</strong>–<strong>{timeEnd}</strong>{" "}
                        | Room <strong>{room}</strong>, Floor{" "}
                        <strong>{floor}</strong>, {building} |{" "}
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {loggedInDean === assignedBy ? (
                        <div className="flex gap-2">
                          <UpdateModal
                            prevSelectedFloor={floor}
                            room={room}
                            selectedDate={selectedDate}
                            prevSelectedBuilding={building}
                            prevSelectedYear={year}
                            prevSelectedSubject={subject}
                            prevSelectedSection={section}
                            buildingData={buildingData}
                            prevSelectedProff={professor?.fullName || "Unknown"}
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
                                professor,
                              })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span>
                          Assigned by: <strong>{assignedBy}</strong>
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccupiedTimeLogs;
