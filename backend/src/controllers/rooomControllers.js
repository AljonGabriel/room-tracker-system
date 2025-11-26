import Room from "../models/Room.js";
import mongoose from "mongoose";

// 📦 Get All Occupied Rooms (future-only, no filters)
export const getAllAssignments = async (req, res) => {
  try {
    // ⏰ Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🧠 Fetch all assignments from today onward
    const allAssignments = await Room.find({ date: { $gte: today } })
      .populate("professor", "fullName role")
      .populate("assignedBy", "fullName role");

    // 🧩 Format response for frontend
    const occupiedRooms = allAssignments.map((entry) => ({
      _id: entry._id,
      timeStart: entry.timeStart,
      timeEnd: entry.timeEnd,
      professor: entry.professor,
      room: entry.room,
      year: entry.year,
      subject: entry.subject,
      section: entry.section,
      building: entry.building,
      floor: entry.floor,
      date: entry.date,
      assignedBy: entry.assignedBy,
    }));

    console.log("✅ All occupied rooms (future only):", occupiedRooms.length);

    // 🚀 Send response
    return res.status(200).json(occupiedRooms);
  } catch (error) {
    console.error("❌ Error in getAllAssignments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/rooms?room=R201&date=2025-09-01
export const getAssignmentsByDate = async (req, res) => {
  try {
    const { room, date } = req.query;

    if (!room || !date) {
      return res.status(200).json([]);
    }

    // ✅ Populate both professor and assignedBy
    const allAssignments = await Room.find({ date })
      .populate("professor", "fullName role")
      .populate("assignedBy", "fullName role");

    console.log("Incoming query:", room, date);
    console.log("allAssignments", allAssignments);

    const occupiedRanges = allAssignments.map((entry) => ({
      _id: entry._id,
      timeStart: entry.timeStart,
      timeEnd: entry.timeEnd,
      professor: entry.professor, // object with fullName + role
      room: entry.room,
      year: entry.year,
      subject: entry.subject,
      section: entry.section,
      building: entry.building,
      floor: entry.floor,
      date: entry.date,
      assignedBy: entry.assignedBy, // now also an object with fullName + role
    }));

    console.log("Occupied ranges (all rooms):", occupiedRanges);

    return res.status(200).json(occupiedRanges);
  } catch (error) {
    console.error("Error in getOccupiedRooms controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller: Handles GET requests to /api/rooms/report
// Dynamically filters Room schedule data based on query parameters

export const getFilteredSchedule = async (req, res) => {
  const { filterType, value } = req.query;

  try {
    // Map frontend filter types to actual MongoDB field names
    const fieldMap = {
      instructor: "professor", // 'Instructor' dropdown maps to 'professor'
      dean: "assignedBy", // 'Dean' dropdown maps to 'assignedBy'
      year: "year", // 'Dean' dropdown maps to 'assignedBy'
      section: "section", // 'Dean' dropdown maps to 'assignedBy'
      subject: "subject", // 'Dean' dropdown maps to 'assignedBy'
      building: "building", // 'Building' maps directly
      date: "date", // 'Date' input maps to 'date' field
    };

    // Resolve the actual MongoDB field name
    const actualField =
      fieldMap[filterType?.toLowerCase()] || filterType?.toLowerCase();

    let query = {};

    if (actualField === "date") {
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0); // normalize to start of day

      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1); // next day start

      query[actualField] = {
        $gte: selectedDate,
        $lt: nextDate,
      };
    } else if (actualField === "professor") {
      // ✅ Validate before casting
      if (mongoose.Types.ObjectId.isValid(value)) {
        query[actualField] = new mongoose.Types.ObjectId(value);
      } else {
        console.warn("❌ Invalid ObjectId:", value);
        return res.status(400).json({ message: "Invalid instructor ID" });
      }
    } else {
      query[actualField] = value.trim();
    }

    // Debug logs for development
    console.log("Filter type:", filterType); // e.g. 'dean'
    console.log("Actual field:", actualField); // e.g. 'assignedBy'
    console.log("Raw value:", value); // e.g. 'IBM - Amor I. Barba, MM '
    console.log("MongoDB query:", query);

    // Query the Room collection using the constructed filter
    const schedule = await Room.find(query)
      .populate("professor", "fullName")
      .populate("assignedBy", "fullName role");

    // Return the filtered schedule data
    res.status(200).json(schedule);
  } catch (error) {
    // Log and return error if something goes wrong
    console.error("Error fetching schedule report:", error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const {
      date,
      year,
      subject,
      section,
      building,
      floor,
      room,
      timeStart,
      timeEnd,
      professor,
      assignedBy,
      repeating,
    } = req.body;

    if (
      !date ||
      !room ||
      !timeStart ||
      !professor ||
      !assignedBy ||
      !subject ||
      !year ||
      !section
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAssignment = new Room({
      date,
      year,
      subject,
      section,
      building,
      floor,
      room,
      timeStart,
      timeEnd,
      professor,
      assignedBy,
      repeating: !!repeating, // ensure boolean
    });

    const saved = await newAssignment.save();

    res.status(201).json({
      message: "Room assigned successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error in assignRoom controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await Room.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
    });

    if (!updated) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Updated successfully", updated });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAssignmentsByProfessor = async (req, res) => {
  const { professor } = req.query;

  if (!professor) {
    return res.status(400).json({ message: "Professor name is required" });
  }

  try {
    const result = await Room.deleteMany({ professor });
    res.status(200).json({
      message: `Deleted ${result.deletedCount} slots for ${professor}`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ message: "Server error during bulk deletion" });
  }
};

export const deleteAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Deleting schedule with ID:", id);

    // Example deletion logic
    const deleteSched = await Room.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "✅ Schedule deleted successfully.", deleteSched });
  } catch (error) {
    console.error("❌ Error deleting schedule:", error);
    res.status(500).json({ error: "Failed to delete schedule." });
  }
};
