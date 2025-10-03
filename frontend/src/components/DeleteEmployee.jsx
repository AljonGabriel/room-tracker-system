import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteEmployee = ({ empID, empName, setEmployees }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await axios.delete(
        `http://localhost:5001/api/employees/delEmp/${empID}`
      );
      toast.success(`Deleted ${empName} successfully`);
      setIsOpen(false);

      setEmployees((prev) => prev.filter((emp) => emp._id !== empID));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-sm btn-outline btn-error"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
            <p className="py-2">
              Are you sure you want to delete <strong>{empName}</strong>?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DeleteEmployee;
