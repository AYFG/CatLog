import express from "express";
import * as dailyLog from "../controllers/dailyLog.js";
const router = express.Router();
router.post("/dailyLog", dailyLog.createDailyLog);
export default router;
