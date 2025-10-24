import React, { useEffect, useState } from "react";
import axios from "axios";
import buildingData from "../data/buildingData";
import subjectsByYear from "../data/subjectsByYear.js";
import sections from "../data/sections.js";

const FilteredReports = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Instructor");
  const [selectedValue, setSelectedValue] = useState("");

  const [instructorsList, setInstructorList] = useState([]);
  const [deansList, setDeansList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  console.log("selectedValue: ", selectedValue);
  useEffect(() => {
    if (!selectedValue) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5001/api/rooms/assignments/filtered",
          {
            params: {
              filterType: selectedFilter.toLowerCase(),
              value: selectedValue,
            },
          }
        );
        setSchedule(res.data);
        console.log("✅ Schedule loaded:", res.data);
      } catch (error) {
        console.error("❌ Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedValue]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/employees/getemp"
        );
        const employees = res.data;

        const instructors = employees
          .filter((emp) => emp.role === "Instructor")
          .map((emp) => ({ id: emp._id, fullName: emp.fullName }));

        setInstructorList(instructors); // ✅ Add this state if needed

        const deans = employees
          .filter((emp) => emp.role === "Dean")
          .map((emp) => ({ id: emp._id, fullName: emp.fullName }));

        setDeansList(deans); // ✅ Add this state if needed

        console.log("Instructors:", instructors);
        console.log("Deans:", deans);
      } catch (error) {
        console.error("❌ Failed to fetch employees", error);

        setInstructorList([]);
      }
    };

    fetchEmployees();
  }, []);

  console.log("instructorsList:", instructorsList);
  console.log("Type of instructorsList:", typeof instructorsList);
  console.log("Is array:", Array.isArray(instructorsList));

  const buildingList = Object.keys(buildingData);

  const subjectList = selectedYear ? subjectsByYear[selectedYear] || [] : [];

  const groupedByProfessor = schedule.reduce((acc, entry) => {
    const key = entry.professor;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  console.log("groupedByProfessor filtered reports: ", groupedByProfessor);

  const handlePrintCard = (professor) => {
    const printArea = document.getElementById(`print-area-${professor}`);
    if (!printArea) return;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Schedule</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
            padding: 2rem;
            font-family: sans-serif;
            background: white;
          }
          .table th, .table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${printArea.innerHTML}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
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
            <option>Year</option>
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
              {Array.isArray(instructorsList) && instructorsList.length > 0 ? (
                instructorsList.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.fullName}
                  </option>
                ))
              ) : (
                <option disabled>No instructors found</option>
              )}
            </select>
          )}

          {selectedFilter === "Dean" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Dean</option>
              {Array.isArray(instructorsList) && instructorsList.length > 0 ? (
                deansList.map((dean) => (
                  <option key={dean.id} value={dean.fullName}>
                    {dean.fullName}
                  </option>
                ))
              ) : (
                <option disabled>No instructors found</option>
              )}
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
            <>
              <select
                className="select select-bordered w-full max-w-xs mb-4"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {Object.keys(subjectsByYear).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {selectedYear && (
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
            </>
          )}

          {selectedFilter === "Year" && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="">Select Year Level</option>
              {Object.keys(subjectsByYear).map((year) => (
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
              {sections.map((section) => (
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
            <div key={professor} className="mb-4">
              <div id={`print-area-${professor}`} className="print-area">
                <div className="card bg-slate-50 shadow-lg">
                  <div className="card-body">
                    <div className="text-center mb-10">
                      <img
                        src="/favicon.png"
                        alt="City College of Angeles Logo"
                        className="mx-auto h-16 mb-2"
                      />
                      <h1 className="text-lg font-bold uppercase text-black">
                        City College of Angeles
                      </h1>
                      <h2 className="text-sm font-medium uppercase text-black tracking-wide">
                        Institute of Business and Management
                      </h2>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => handlePrintCard(professor)}
                        className="btn btn-outline btn-primary"
                      >
                        🖨️ Print
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead className="bg-gray-700 text-white sticky top-0 z-10">
                          <tr>
                            <th className="text-sm">Date</th>
                            <th className="text-sm">Time</th>
                            <th className="text-sm">Room</th>
                            <th className="text-sm">Floor</th>
                            <th className="text-sm">Building</th>
                            <th className="text-sm">Subject</th>
                            <th className="text-sm">Year</th>
                            <th className="text-sm border-r border-white">
                              Section
                            </th>
                            <th className="text-sm">Professor</th>
                            <th className="text-sm">Assigned By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(entries) ? (
                            entries.map((entry, index) => (
                              <tr
                                key={entry._id}
                                className={
                                  index % 2 === 0
                                    ? "bg-gray-500"
                                    : "bg-gray-600"
                                }
                              >
                                <td>
                                  {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td>
                                  <span>
                                    {entry.timeStart} - {entry.timeEnd}
                                  </span>
                                </td>
                                <td>{entry.room}</td>
                                <td>{entry.floor}</td>
                                <td>{entry.building}</td>
                                <td>{entry.subject}</td>
                                <td>{entry.year}</td>
                                <td className="text-sm border-r border-white">
                                  {entry.section}
                                </td>
                                <td>{entry.professor?.fullName}</td>
                                <td className="text-sm text-white">
                                  {entry.assignedBy}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="10"
                                className="text-center text-white bg-red-500"
                              >
                                ⚠️ Invalid data — entries is not an array
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
