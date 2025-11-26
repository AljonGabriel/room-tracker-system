import mongoose from "mongoose";

// 1 - create a schema
// 2 - model based of that schema

const roomSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    year: {
      type: String,
      Required: true,
    },
    subject: {
      type: String,
      Required: true,
    },
    section: {
      type: String,
      Required: true,
    },
    building: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    timeStart: {
      type: String, // Format: "HH:mm" (e.g., "13:00")
      required: true,
    },
    timeEnd: {
      type: String, // Same format as timeStart
      required: true,
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees", // or whatever your model name is
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    },
    repeating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
