import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddEmployee = ({ setEmployees, deansList }) => {
  const isLocal = window.location.hostname === "localhost";

  const storedDean = localStorage.getItem("loggedInDean");
  const dean = storedDean ? JSON.parse(storedDean) : null;

  console.log("isLocal", isLocal);
  const API_BASE = isLocal
    ? "http://localhost:5001" // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  const [hiringDate, setHiringDate] = useState("");
  const [reportsTo, setReportsTo] = useState(dean?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !role || !hiringDate) {
      toast.error("Please fill out all forms");
      return;
    }

    try {
      const payload = {
        fullName,
        role,
        username,
        pwd,
        hiringDate,
        reportsTo,
      };

      const result = await axios.post(
        `${API_BASE}/api/employees/newrecord`,
        payload
      );

      console.log(result);
      toast.success("Employee added successfully!", result.data.newRecord);

      setEmployees((prev) => [...prev, result.data.newRecord]);

      toast.success("Employee added successfully!");
    } catch (error) {
      toast.error("Failed to add employee");
      console.error(error);
    }
  };

  console.log("role", role);

  return (
    <div>
      <label
        htmlFor="add-employee-modal"
        className="btn btn-primary btn-outline btn-sm cursor-pointer"
      >
        Add Employee
      </label>

      {/* Modal */}
      <input type="checkbox" id="add-employee-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="text-2xl font-bold  mb-4">New record</h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="label font-medium">Full Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                required
              />
            </div>
            {/* Role Dropdown */}
            <div>
              <label className="label font-medium">Role</label>

              <select
                className="select select-bordered w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {dean?.role === "SuperAdmin" && (
                  <option value="Dean">Dean</option>
                )}
                <option value="Instructor">Instructor</option>
              </select>
            </div>
            {role === "Dean" && (
              <>
                <div>
                  <label className="label font-medium">Username</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label font-medium">Password</label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {role === "Instructor" && dean?.role !== "SuperAdmin" && (
              <>
                {" "}
                <div>
                  {" "}
                  <label className="label font-medium">Reporting to</label>{" "}
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                    value={reportsTo && dean?.fullName}
                    disabled
                    required
                  />{" "}
                </div>{" "}
              </>
            )}

            {role === "Instructor" && dean?.role === "SuperAdmin" && (
              <div>
                <label className="label font-medium">Reporting to</label>
                <select
                  className="select select-bordered w-full"
                  value={reportsTo}
                  onChange={(e) => setReportsTo(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Select dean
                  </option>
                  {deansList.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Hiring Date */}
            <div>
              <label className="label font-medium">Hiring Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={hiringDate}
                onChange={(e) => setHiringDate(e.target.value)}
                required
              />
            </div>
            {/* Modal Actions */}
            <div className="modal-action">
              <label
                htmlFor="add-employee-modal"
                className="btn btn-outline btn-error"
              >
                Cancel
              </label>
              <button type="submit" className="btn btn-primary">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
