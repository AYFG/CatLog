import express from "express";
import * as medicalLog from "../controllers/medicalLog.js";
import { authChecker } from "../middleware/authChecker.js";
const router = express.Router();
router.post("/:catId", authChecker, medicalLog.createMedicalLog);
export default router;
