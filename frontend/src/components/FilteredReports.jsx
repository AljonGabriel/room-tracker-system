import React, { useEffect, useState } from "react";
import axios from "axios";
import buildingData from "../data/buildingData";
import { deanList, professorList } from "../data/userLists";
import subjectsByYear from "../data/subjectsByYear.js";

const FilteredReports = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Instructor");
  const [selectedValue, setSelectedValue] = useState("");

  // Year and subject toggle
  const subjectOptions = selectedYear ? subjectsByYear[selectedYear] : [];

  console.log(selectedValue);
  const buildingList = Object.keys(buildingData);
  useEffect(() => {
    if (!selectedValue) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5001/api/rooms/report", {
          params: {
            filterType: selectedFilter.toLowerCase(),
            value: selectedValue,
          },
        });
        setSchedule(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedValue]);

  // Group schedule entries by professor
  const groupedByProfessor = schedule.reduce((acc, entry) => {
    const prof = entry.professor || "Unassigned";
    if (!acc[prof]) acc[prof] = [];
    acc[prof].push(entry);
    return acc;
  }, {});

  return (
    <div className="bg-base-200 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-primary text-center">
          Filtered by <span className="text-secondary">{selectedFilter}</span>
        </h1>

        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Filter Type Selector */}
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedFilter}
            onChange={(e) => {
              setSelectedFilter(e.target.value);
              setSelectedValue(""); // reset value
            }}
          >
            <option>Instructor</option>
            <option>Dean</option>
            <option>Building</option>
            <option>Date</option>
            <option>Subject</option>
            <option>Year Level</option>
            <option>Section</option>
          </select>

          {/* Value Selector Based on Filter */}
          {selectedFilter === "Instructor" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Instructor</option>
              {professorList.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          )}

          {selectedFilter === "Dean" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Dean</option>
              {deanList.map((dean) => (
                <option key={dean} value={dean}>
                  {dean}
                </option>
              ))}
            </select>
          )}

          {selectedFilter === "Building" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Building</option>
              {buildingList.map((bldg) => (
                <option key={bldg} value={bldg}>
                  {bldg}
                </option>
              ))}
            </select>
          )}

          {selectedFilter === "Date" && (
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
          )}

          {selectedFilter === "Subject" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjectList.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          )}

          {selectedFilter === "Year" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Year Level</option>
              {yearList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}

          {selectedFilter === "Section" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Section</option>
              {sectionList.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <p className="text-center text-neutral-content">
            Loading schedule...
          </p>
        ) : Object.keys(groupedByProfessor).length > 0 ? (
          Object.entries(groupedByProfessor).map(([professor, entries]) => (
            <div key={professor} className="mb-12">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="text-2xl  mb-4 border-b border-base-300 pb-2">
                    {professor}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table table-sm table-zebra w-full">
                      <thead className="bg-neutral text-neutral-content sticky top-0 z-10">
                        <tr>
                          <th className="text-sm">Date</th>
                          <th className="text-sm">Time</th>
                          <th className="text-sm">Room</th>
                          <th className="text-sm">Floor</th>
                          <th className="text-sm">Building</th>
                          <th className="text-sm">Subject</th>
                          <th className="text-sm">Year</th>
                          <th className="text-sm">Section</th>
                          <th className="text-sm">Assigned By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr
                            key={entry._id}
                            className="hover:bg-base-300 transition"
                          >
                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                            <td>
                              <span className="badge badge-outline badge-info">
                                {entry.timeStart} - {entry.timeEnd}
                              </span>
                            </td>
                            <td>{entry.room}</td>
                            <td>{entry.floor}</td>
                            <td>{entry.building}</td>
                            <td>{entry.subject}</td>
                            <td>{entry.year}</td>
                            <td>{entry.section}</td>
                            <td className="text-sm text-neutral">
                              {entry.assignedBy}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-content mt-10">
            No schedule data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default FilteredReports;
