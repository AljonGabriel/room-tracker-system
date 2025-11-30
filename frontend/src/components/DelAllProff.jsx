import React from "react";
import axios from "axios";

const DelAllProff = ({ setEmployees }) => {
  const storedDean = localStorage.getItem("loggedInDean");
  const loggedInDean = storedDean ? JSON.parse(storedDean) : null;

  const isLocal = window.location.hostname === "localhost";
  const API_BASE = isLocal
    ? "http://localhost:5001"
    : import.meta.env.VITE_API_BASE;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL instructors/professors? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${API_BASE}/api/employees/delete/allproff`
      );

      // ✅ Only remove instructors/professors locally, keep deans/superadmins
      setEmployees((prev) =>
        prev.filter(
          (emp) => emp.role !== "Instructor" && emp.role !== "Professor"
        )
      );

      alert(`${res.data.deletedCount} instructors deleted successfully!`);
    } catch (error) {
      console.error("Error deleting instructors:", error);
      alert("Failed to delete instructors");
    }
  };

  return (
    <>
      {loggedInDean?.role === "SuperAdmin" && (
        <button
          onClick={handleDelete}
          className="btn btn-error btn-sm cursor-pointer"
        >
          Delete All
        </button>
      )}
    </>
  );
};

export default DelAllProff;
