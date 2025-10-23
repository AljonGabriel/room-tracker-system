import axios from "axios";
import { useState } from "react";
import buildingData from "../data/buildingData";
import toast from "react-hot-toast";
import UpdateSchedule from "./UpdateSchedule";
import DelSchedule from "./DelSchedule";

const OccupiedTimeLogs = ({
  groupedByProfessor,
  uniqueProfessors,
  getColorClass,
  selectedDean,
  selectedDate,
  occupiedTimes,
  timeSlots,
  subjectsByYear,
  sections,
  setOccupiedTimes,
 
}) => {
  const loggedInDean = localStorage.getItem("loggedInDean");
  return (
    <div>
      <h4 className="font-semibold text-md text-base-content my-3">
        Occupied Time Slots:
      </h4>

      {/* Legend */}
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      {Array.from(
        new Map(
          uniqueProfessors
            .filter((prof) => prof && prof.fullName)
            .map((prof) => [prof.fullName, prof])
        ).values()
      ).map((prof) => {
        const { bg } = getColorClass(prof.fullName);
        return (
          <div key={prof._id} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${bg}`}></div>
            <span className="text-sm font-medium text-base-content">
              {prof.fullName || "Unknown"}
            </span>
          </div>
        );
      })}
    </div>

      {/* Grouped Slot Display */}
      <div className="mt-4 max-h-96 overflow-y-auto space-y-1">
        {Object.entries(groupedByProfessor).map(([profId, group]) => {
          const professor = group?.professor;
          const slots = Array.isArray(group?.slots) ? group.slots : [];

          const name = professor?.fullName || "Unknown";
          const { border } = getColorClass(name);

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

          return (
            <div
              key={profId}
              className={`border-2 rounded p-4 bg-neutral text-neutral-content ${border}`}
            >
              <div className="mb-2 text-md font-bold">{name}</div>

              <div className="space-y-2">
                {uniqueSlots.map((slot, index) => (
                  <div
                    key={slot._id || index}
                    className="bg-base-200 rounded-md p-2 text-sm text-base-content flex justify-between items-center"
                  >
                    <div>
                      <strong>{slot.timeStart}</strong>–
                      <strong>{slot.timeEnd}</strong> | Room{" "}
                      <strong>{slot.room}</strong>, Floor{" "}
                      <strong>{slot.floor}</strong>, {slot.building} |{" "}
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {loggedInDean === slot.assignedBy ? (
                      <div className="flex gap-2">
                        <UpdateSchedule
                          prevSelectedFloor={slot.floor}
                          room={slot.room}
                          selectedDate={selectedDate}
                          prevSelectedBuilding={slot.building}
                          prevSelectedYear={slot.year}
                          prevSelectedSubject={slot.subject}
                          prevSelectedSection={slot.section}
                          buildingData={buildingData}
                          prevSelectedProff={
                            slot.professor?.fullName || "Unknown"
                          }
                          selectedDean={selectedDean}
                          id={slot._id}
                          timeStart={slot.timeStart}
                          timeEnd={slot.timeEnd}
                          timeSlots={timeSlots}
                          occupiedTimes={occupiedTimes}
                          setOccupiedTimes={setOccupiedTimes}
                          subjectsByYear={subjectsByYear}
                          sections={sections}
                          
                        />
                      <DelSchedule />
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
          );
        })}
      </div>
    </div>
  );
};

export default OccupiedTimeLogs;
