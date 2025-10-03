import express from "express";

import {
  addEmp,
  delEmp,
  editEmp,
  getEmp,
} from "../controllers/employeeControllers.js";

const router = express.Router();

router.post("/newrecord", addEmp);
router.get("/getemp", getEmp);
router.put("/updateEmp/:id", editEmp);
router.delete("/delEmp/:id", delEmp);

export default router;
