import Employee from "../models/Employee.js";

export const getEmp = async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all records
    res.status(200).json(employees); // Send them back to the frontend
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to retrieve employees", error });
  }
};

export const addEmp = async (req, res) => {
  const { fullName, role, hiringDate } = req.body;

  if (!fullName || !role || !hiringDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newEmployee = new Employee({
      fullName,
      role,
      hiringDate,
    });

    const employed = await newEmployee.save();

    res
      .status(201)
      .json({ message: "New employee added", newRecord: employed });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Employee received", error });
  }
};

export const editEmp = async (req, res) => {
  const { id } = req.params;
  const { fullName, role } = req.body;

  if (!fullName || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updated = await Employee.findByIdAndUpdate(
      id,
      { fullName, role },
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
    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "✅ Employee deleted successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
