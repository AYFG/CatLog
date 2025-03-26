import * as postController from "./../controllers/post.js";
import express from "express";
const router = express.Router();
router.post("/calendar", postController.postCalendar);
export default router;
