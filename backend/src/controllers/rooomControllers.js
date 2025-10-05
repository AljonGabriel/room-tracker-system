import Room from "../models/Room.js";

// GET /api/rooms?room=R201&date=2025-09-01
export const getOccupiedRooms = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { room, date } = req.query;

    // If either room or date is missing, return an empty array
    if (!room || !date) {
      return res.status(200).json([]);
    }

    // Fetch all assignments for the specified date (across all rooms)
    const allAssignments = await Room.find({ date });

    // Log incoming query for debugging
    console.log("Incoming query:", room, date);

    // Map the results to a simplified structure for frontend use
    const occupiedRanges = allAssignments.map((entry) => ({
      _id: entry._id,
      timeStart: entry.timeStart, // Start time of the booking
      timeEnd: entry.timeEnd, // End time of the booking
      professor: entry.professor, // Who's assigned
      room: entry.room, // Room assigned
      building: entry.building, // Building info
      floor: entry.floor, // Floor info
      date: entry.date, // Floor info
    }));

    // Log the full list of occupied ranges for visibility
    console.log("Occupied ranges (all rooms):", occupiedRanges);

    // Return all time slots for the date, including cross-room professor conflicts
    return res.status(200).json(occupiedRanges);
  } catch (error) {
    // Log any unexpected errors
    console.error("Error in getOccupiedRooms controller", error);

    // Return a generic server error response
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
      building: "building", // 'Building' maps directly
      date: "date", // 'Date' input maps to 'date' field
    };

    // Escape special characters for safe regex usage
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Resolve the actual MongoDB field name
    const actualField =
      fieldMap[filterType?.toLowerCase()] || filterType?.toLowerCase();

    let query = {};

    if (actualField && value) {
      if (actualField === "date") {
        // Parse incoming date string (e.g. '2025-09-01') into a Date object
        const inputDate = new Date(value);
        const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

        // Match any schedule within that full day
        query.date = { $gte: startOfDay, $lte: endOfDay };
      } else {
        // Escape and trim the value, allowing optional trailing whitespace
        const escapedValue = escapeRegex(value.trim());

        // Build regex query for string fields
        query[actualField] = {
          $regex: new RegExp(`^${escapedValue}\\s*$`, "i"),
        };
      }
    }

    // Debug logs for development
    console.log("Filter type:", filterType); // e.g. 'dean'
    console.log("Actual field:", actualField); // e.g. 'assignedBy'
    console.log("Raw value:", value); // e.g. 'IBM - Amor I. Barba, MM '
    console.log("MongoDB query:", query);

    // Query the Room collection using the constructed filter
    const schedule = await Room.find(query);

    // Return the filtered schedule data
    res.status(200).json(schedule);
  } catch (error) {
    // Log and return error if something goes wrong
    console.error("Error fetching schedule report:", error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

export const assignRoom = async (req, res) => {
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

export const updateOccupiedRoomTime = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await Room.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      runValidators: true, // optional: enforce schema validation
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

export const deleteOccupiedRoomTime = async (req, res) => {
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

export const deleteOccupiedTimeByID = async (req, res) => {
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
