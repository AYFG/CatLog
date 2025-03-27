import express from "express";
import * as medicalLog from "../controllers/medicalLog.js";
const router = express.Router();
router.post("/medicalLog", medicalLog.createMedicalLog);
export default router;
