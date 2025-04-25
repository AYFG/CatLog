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
    body("name")
        .trim()
        .isLength({ min: 2, max: 8 })
        .withMessage("닉네임은 2자 이상 8자 이하로 입력해주세요."),
    body("password").trim().isLength({ min: 6 }).withMessage("비밀번호는 6자 이상이어야 합니다."),
], (req, res, next) => authController.signup(req, res, next));
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
export default router;
