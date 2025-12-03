import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditEmployee = ({
  empID,
  empName,
  empRole,
  empUsername,
  empPwd,
  setEmployees,
}) => {
  const isLocal = window.location.hostname === "localhost";

  const API_BASE = isLocal
    ? "http://localhost:5001" // 👈 your local backend
    : import.meta.env.VITE_API_BASE; // 👈 your Render backend

  const [isOpen, setIsOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState(empName || "");
  const [updatedRole, setUpdatedRole] = useState(empRole || "");

  const [updateUsername, setUpdateUsername] = useState(empUsername || "");
  const [updatePWD, setUpdatePWD] = useState(empPwd || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      fullName: updatedName,
      role: updatedRole,
      username: updateUsername,
      pwd: updatePWD,
    };

    try {
      const res = await axios.put(
        `${API_BASE}/api/employees/updateEmp/${empID}`,
        payload
      );
      console.log("res", res);
      toast.success("Employee updated successfully!");
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === res.data.data._id ? res.data.data : emp))
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-outline btn-warning"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-warning">Edit Employee</h3>

            <form
              className="py-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered w-full"
                  onChange={(e) => setUpdatedName(e.target.value)}
                  value={updatedName}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={updatedRole}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                >
                  <option disabled value="">
                    Select role
                  </option>
                  <option value="Dean">Dean</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>

              {updatedRole === "Dean" && (
                <>
                  <div>
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="input input-bordered w-full"
                      onChange={(e) => setUpdateUsername(e.target.value)}
                      value={updateUsername}
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="input input-bordered w-full pr-10"
                        onChange={(e) => setUpdatePWD(e.target.value)}
                        value={updatePWD}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-sm text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning">
                  Save
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};

export default EditEmployee;
