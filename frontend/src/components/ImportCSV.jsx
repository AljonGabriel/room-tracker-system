import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import toast from "react-hot-toast";

const ImportCSV = ({ API_BASE, setEmployees }) => {
  const [rows, setRows] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const fileInputRef = useRef(null);

  // 🔎 Fetch all employees once to build a name→ID map
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/employees/getemp`);
        const map = {};
        res.data.forEach((emp) => {
          if (emp.fullName) {
            map[emp.fullName.trim()] = emp._id;
          }
        });
        setEmployeesMap(map);
      } catch (err) {
        console.error("Failed to fetch employees for mapping:", err);
        toast.error("Failed to fetch employees for Reports To mapping");
      }
    };
    fetchEmployees();
  }, [API_BASE]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const expectedHeaders = ["Name", "Role", "Reports To", "Hiring Date"];
        const fileHeaders = results.meta.fields;

        const missingHeaders = expectedHeaders.filter(
          (h) => !fileHeaders.includes(h)
        );

        if (missingHeaders.length > 0) {
          toast.error(`Missing headers: ${missingHeaders.join(", ")}`);
          return;
        }

        setRows(results.data);
      },
    });
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      toast.error("No data to import!");
      return;
    }

    try {
      for (const [i, row] of rows.entries()) {
        // ✅ Only allow Instructor rows
        if (row.Role !== "Instructor") {
          toast.error(`Row ${i + 2}: Only Instructors can be imported.`);
          return; // stop import
        }

        // ✅ Required fields check
        if (
          !row.Name ||
          !row.Role ||
          !row["Reports To"] ||
          !row["Hiring Date"]
        ) {
          toast.error(
            `Row ${
              i + 2
            }: All fields (Name, Role, Reports To, Hiring Date) are required.`
          );
          return; // stop import
        }

        // 🔎 Lookup Reports To name in employeesMap
        const reportsToId = employeesMap[row["Reports To"].trim()];
        if (!reportsToId) {
          toast.error(
            `Row ${i + 2}: Reports To "${row["Reports To"]}" not found in DB.`
          );
          return; // stop import
        }

        const payload = {
          fullName: row.Name,
          role: row.Role,
          hiringDate: row["Hiring Date"],
          reportsTo: reportsToId, // ✅ use ObjectId instead of string
        };

        const result = await axios.post(
          `${API_BASE}/api/employees/newrecord`,
          payload
        );

        setEmployees((prev) => [...prev, result.data.newRecord]);
        toast.success(`Instructor ${row.Name} added successfully!`);
      }

      setRows([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to import employees");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Instruction steps */}
      <div className="mb-2 text-sm text-gray-600">
        <p>
          <span className="font-semibold">1st:</span> Choose a CSV file with
          instructor data.
        </p>
        <p>
          <span className="font-semibold">2nd:</span> Click <em>Import CSV</em>{" "}
          to upload and insert instructors.
        </p>
      </div>

      {/* Title bar */}
      <div className="px-3 py-2 border-b bg-gray-100 rounded-t">
        <label className="text-sm font-semibold text-gray-700">
          Insert multiple instructors
        </label>
      </div>

      {/* Action block */}
      <div className="border border-gray-300 rounded p-3 flex items-center gap-3 bg-gray-50">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input file-input-bordered file-input-sm flex-1"
        />
        <button
          onClick={handleImport}
          className="btn btn-secondary btn-outline btn-sm"
        >
          Import CSV
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-3">
          <h3 className="font-semibold mb-2">Preview:</h3>
          <div className="bg-gray-800 text-white p-2 rounded text-sm max-h-48 overflow-y-auto border border-gray-600">
            {rows.map((row, idx) => (
              <div key={idx} className="border-b border-gray-700 py-1">
                <span className="font-medium">{row.Name}</span> — {row.Role} —{" "}
                {row["Hiring Date"]} — Reports To: {row["Reports To"]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCSV;
