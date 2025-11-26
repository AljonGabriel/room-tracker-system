// middleware/employeeHooks.js
import mongoose from "mongoose";

export default function employeeHooks(employeeSchema) {
  // Runs before deleting an employee
  employeeSchema.pre("findOneAndDelete", async function (next) {
    const employeeId = this.getQuery()._id;

    // Delete all rooms assigned by this dean
    await mongoose.model("Room").deleteMany({ assignedBy: employeeId });

    next();
  });
}
