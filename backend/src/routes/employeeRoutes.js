import express from 'express';

import {
  addEmp,
  delEmp,
  editEmp,
  getEmp,
  delAllProff,
  delSchedByProff,
} from '../controllers/employeeControllers.js';

const router = express.Router();

router.post('/newrecord', addEmp);
router.get('/getemp', getEmp);
router.put('/updateEmp/:id', editEmp);
router.delete('/delEmp/:id', delEmp);
router.delete('/delete/allproff', delAllProff);
router.delete('/byprof/:profID', delSchedByProff);

export default router;
