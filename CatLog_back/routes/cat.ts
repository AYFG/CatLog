import express from "express";
import * as cat from "../controllers/cat.js";
import { authChecker } from "../middleware/authChecker.js";

const router = express.Router();

router.post("/", authChecker, cat.createCat);
router.get("/:userId", authChecker, cat.getCat);

export default router;
