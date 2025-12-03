import buildingData from '../data/buildingData';
import UpdateSchedule from './UpdateSchedule';
import DelSchedule from './DelSchedule';
import ModalWrapper from './modals/ModalWrapper';
import { useState } from 'react';
import OccupiedRoomsList from './OccupiedRoomsList';

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
  onSetOccupiedTimes,
  onResetForm,
}) => {
  const loggedInDean = localStorage.getItem('loggedInDean');

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4'>
        <h4 className='font-semibold text-lg text-base-content'>
          📌 Scheduled Rooms logs
        </h4>

        <button
          onClick={() => setIsModalOpen(true)}
          className='btn btn-secondary btn-outline'>
          View All
        </button>
        <ModalWrapper
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}>
          <OccupiedRoomsList />
        </ModalWrapper>
      </div>

      {/* Legend */}
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

      {/* Grouped Slot Display */}
      <div className='mt-4 max-h-55 overflow-y-auto space-y-1'>
        {Object.entries(groupedByProfessor).map(([profId, group]) => {
          const professor = group?.professor;
          const slots = Array.isArray(group?.slots) ? group.slots : [];

          const name = professor || 'Unknown';
          const { border } = getColorClass(name);

          console.log('Slots for professor', name, slots, professor);

          const uniqueSlots = slots
            .filter((slot, index, self) => {
              return (
                self.findIndex(
                  (s) =>
                    s.timeStart === slot.timeStart &&
                    s.timeEnd === slot.timeEnd &&
                    s.professor?._id === slot.professor?._id,
                ) === index
              );
            })
            .sort((a, b) => {
              const timeA = new Date(`1970-01-01T${a.timeStart}`);
              const timeB = new Date(`1970-01-01T${b.timeStart}`);
              return timeA - timeB;
            });

          return (
            <div
              key={profId}
              className={`border-2 rounded p-4 bg-neutral text-neutral-content ${border}`}>
              <div className='mb-2 text-md font-bold'>{name}</div>

              <div className='space-y-2'>
                {uniqueSlots.map((slot, index) => (
                  <div
                    key={slot._id || index}
                    className='bg-base-200 rounded-md p-2 text-sm text-base-content flex justify-between items-center'>
                    <div className='text-sm text-base-content space-y-1'>
                      <div>
                        🕒 <strong>{slot.timeStart}</strong>–
                        <strong>{slot.timeEnd}</strong> on{' '}
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div>
                        🏫 <strong>{slot.building}</strong>, Floor{' '}
                        <strong>{slot.floor}</strong>, Room{' '}
                        <strong>{slot.room}</strong>
                      </div>
                      <div>
                        🎓 <strong>{slot.year}</strong> | 📘{' '}
                        <strong>{slot.subject}</strong> | 🧑‍🏫{' '}
                        <strong>{slot.section}</strong>
                      </div>
                    </div>
                    {loggedInDean === slot.assignedBy ? (
                      <div className='flex gap-2'>
                        <UpdateSchedule
                          prevSelectedFloor={slot.floor}
                          room={slot.room}
                          selectedDate={selectedDate}
                          prevSelectedBuilding={slot.building}
                          prevSelectedYear={slot.year}
                          prevSelectedSubject={slot.subject}
                          prevSelectedSection={slot.section}
                          prevSelectedRoom={slot.room}
                          buildingData={buildingData}
                          prevSelectedProff={
                            slot.professor?.fullName || 'Unknown'
                          }
                          selectedDean={selectedDean}
                          scheduledID={slot._id}
                          timeStart={slot.timeStart}
                          timeEnd={slot.timeEnd}
                          timeSlots={timeSlots}
                          occupiedTimes={occupiedTimes}
                          onSetOccupiedTimes={onSetOccupiedTimes}
                          onResetForm={onResetForm}
                          subjectsByYear={subjectsByYear}
                          sections={sections}
                        />
                        <DelSchedule
                          scheduledID={slot._id}
                          assignedProf={slot.professor?.fullName}
                          onOccupiedTimes={occupiedTimes}
                          onSetOccupiedTimes={onSetOccupiedTimes}
                        />
                      </div>
                    ) : (
                      <span>
                        Assigned by:{' '}
                        <strong>{slot.assignedBy?.fullName}</strong>
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
