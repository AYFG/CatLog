import express from "express";
import * as dailyLog from "../controllers/dailyLog.js";
import { authChecker } from "../middleware/authChecker.js";
const router = express.Router();
router.post("/:catId", authChecker, dailyLog.createDailyLog);
router.get("/", authChecker, dailyLog.getDailyLog);
router.get("/everyLogDates", authChecker, dailyLog.getDailyLogDates);
router.delete("/:dailyLogId", authChecker, dailyLog.deleteDailyLog);
export default router;
