import express from "express";
import { body } from "express-validator";
import UserModel from "../models/user.js";
import * as authController from "../controllers/auth.js";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

interface CustomRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("올바른 이메일을 입력하세요")
      .custom((value: string, { req }) => {
        return UserModel.findOne({ email: value })
          .then((userDoc: any) => {
            if (userDoc) {
              return Promise.reject("이미 사용중인 이메일입니다.");
            }
          })
          .catch();
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  (req: CustomRequest, res: Response, next: NextFunction) => authController.signup(req, res, next),
);

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
