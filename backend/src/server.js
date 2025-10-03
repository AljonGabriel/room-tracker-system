import roomRoutes from "./routes/roomRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { connectDB } from "./config/db.js";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // install and import dotenv to use the env variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware will check first before going to the main function

//middleware also needs for Postman
app.use(cors());

app.use(express.json()); // this middleware will parse JSON bodies: req.body
// Our simple custom middleware
app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

// routes
app.use("/api/rooms", roomRoutes);
app.use("/api/employees", employeeRoutes);

// Connect the DB first before listening to the Port is a must!!
connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started on PORT:", PORT);
  });
});
