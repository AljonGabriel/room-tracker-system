import mongoose from 'mongoose';
import employeeHooks from '../middleware/employeeHooks.js';

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    pwd: {
      type: String,
    },
    hiringDate: {
      type: Date,
      required: true,
    },
    reportsTo: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Apply middleware
employeeHooks(employeeSchema);

const Employee = mongoose.model('Employees', employeeSchema);

export default Employee;
