import Employee from "../models/Employee.js";
import Room from "../models/Room.js";

export const getEmp = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "reportsTo",
      "fullName role"
    );
    // 👆 populate dean info, only return fullName + role fields

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to retrieve employees", error });
  }
};

export const addEmp = async (req, res) => {
  const { fullName, role, username, pwd, hiringDate, reportsTo } = req.body;

  if (!fullName || !role || !hiringDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newEmployee = new Employee({
      fullName,
      role,
      username,
      pwd,
      hiringDate,
      reportsTo,
    });

    const employed = await newEmployee.save();

    const populated = await Employee.findById(employed._id).populate(
      "reportsTo",
      "fullName role"
    );

    res
      .status(201)
      .json({ message: "New employee added", newRecord: populated });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Employee received", error });
  }
};

export const editEmp = async (req, res) => {
  const { id } = req.params;
  const { fullName, role, username, pwd } = req.body;

  if (!fullName || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updated = await Employee.findByIdAndUpdate(
      id,
      { fullName, role, username, pwd },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const delEmp = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing employee ID" });
  }

  try {
    // Delete the employee
    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Cascade delete: remove all rooms assigned by this employee
    await Room.deleteMany({ assignedBy: id });

    // Cascade delete: remove all rooms assigned by this employee
    await Room.deleteMany({ professor: id });

    return res.status(200).json({
      message: "✅ Employee and their assigned rooms deleted successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const delAllProff = async (req, res) => {
  try {
    // Find all instructors first
    const instructors = await Employee.find({ role: "Instructor" });
    const instructorIds = instructors.map((inst) => inst._id);

    // Delete all instructors
    const result = await Employee.deleteMany({ role: "Instructor" });

    // Cascade delete: remove all rooms assigned to those instructors
    await Room.deleteMany({ professor: { $in: instructorIds } });

    res.status(200).json({
      message: "Successfully deleted all Instructors and their assigned rooms",
      deletedCount: result.deletedCount,
      roomsDeleted: instructorIds.length, // optional: count of affected rooms
    });
  } catch (error) {
    console.error("Error deleting instructors:", error);
    res.status(500).json({
      message: "Failed to delete instructors",
      error,
    });
  }
};
