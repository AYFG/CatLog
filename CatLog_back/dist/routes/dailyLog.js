import express from "express";
import * as dailyLog from "../controllers/dailyLog.js";
import { authChecker } from "../middleware/authChecker.js";
const router = express.Router();
router.post("/:catId", authChecker, dailyLog.createDailyLog);
router.get("/", authChecker, dailyLog.getDailyLog);
export default router;
