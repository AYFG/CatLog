import express from "express";
import * as dailyLog from "../controllers/dailyLog.js";
const router = express.Router();
router.post("/:catId", dailyLog.createDailyLog);
export default router;
