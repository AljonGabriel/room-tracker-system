import express from "express";
import {
  deleteOccupiedRoomTime,
  getOccupiedRooms,
  assignRoom,
  updateOccupiedRoomTime,
  getFilteredSchedule,
  deleteOccupiedTimeByID,
} from "../controllers/rooomControllers.js";

const router = express.Router();

router.get("/", getOccupiedRooms);

router.get("/report", getFilteredSchedule);

router.post("/", assignRoom);

router.put("/:id", updateOccupiedRoomTime);

// Delete all schedules for a specific professor
router.delete("/occupiedTime", deleteOccupiedRoomTime);

// Delete schedules by time range
router.delete("/occupiedTime/:id", deleteOccupiedTimeByID); // Accepts timeStart/timeEnd in body or query

export default router;
