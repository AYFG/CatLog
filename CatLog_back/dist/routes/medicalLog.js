import express from "express";
import * as medicalLog from "../controllers/medicalLog.js";
import { authChecker } from "../middleware/authChecker.js";
const router = express.Router();
router.post("/:catId", authChecker, medicalLog.createMedicalLog);
router.get("/:userId", authChecker, medicalLog.getMedicalLog);
export default router;
