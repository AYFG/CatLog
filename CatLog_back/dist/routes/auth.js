import express from "express";
import { body } from "express-validator";
import UserModel from "../models/user.js";
import * as authController from "../controllers/auth.js";
const router = express.Router();
router.post("/signup", [
    body("email")
        .isEmail()
        .withMessage("올바른 이메일을 입력하세요")
        .custom((value, { req }) => {
        return UserModel.findOne({ email: value })
            .then((userDoc) => {
            if (userDoc) {
                return Promise.reject("이미 사용중인 이메일입니다.");
            }
        })
            .catch();
    })
        .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
], (req, res, next) => authController.signup(req, res, next));
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
export default router;
