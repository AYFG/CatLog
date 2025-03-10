import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { ObjectId } from "mongodb";

interface SignupRequest extends Request {
  body: {
    email: string;
    name: string;
    password: string;
  };
}

export const signup = (req: SignupRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error: any = new Error("검증 실패");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  interface HashedPasswordResult {
    hashedPassword: string;
  }

  interface UserSaveResult {
    _id: ObjectId;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword: HashedPasswordResult["hashedPassword"]) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return user.save();
    })
    .then((result: UserSaveResult) => {
      res.status(201).json({ message: "유저 생성 성공", userId: result._id });
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
