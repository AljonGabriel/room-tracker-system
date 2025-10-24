import express from "express";
import {
  deleteAssignmentsByProfessor,
  getAssignmentsByDate,
  createAssignment,
  updateAssignment,
  getFilteredSchedule,
  deleteAssignmentById,
  getAllAssignments,
} from "../controllers/rooomControllers.js";

const router = express.Router();

// 📅 Get assignments filtered by date
router.get("/assignments/by-date", getAssignmentsByDate); // Use query param: ?date=2025-10-24

// 🧾 Get all assignments (no filters)
router.get("/assignments/", getAllAssignments); // Optional: merge with above if logic allows

// 📊 Get filtered report (e.g., by building, professor)
router.get("/assignments/filtered", getFilteredSchedule);

// 🏫 Create a new assignment
router.post("/assignments/", createAssignment);

// ✏️ Update an assignment by ID
router.put("/assignments/:id", updateAssignment);

// ❌ Delete a specific assignment by ID
router.delete("/assignments/:id", deleteAssignmentById);

export default router;
