import { validationResult, ValidationError } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { ObjectId } from "mongodb";

const AUTH_SECRET = process.env.AUTH_SECRET;

interface SignupRequest extends Request {
  body: {
    email: string;
    name: string;
    password: string;
  };
}
interface CustomError extends Error {
  statusCode: number;
  data: ValidationError[];
}

export const signup = (req: SignupRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error = new Error("검증 실패") as CustomError;
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
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const login = (req: SignupRequest, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser: InstanceType<typeof User>;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("해당 이메일을 가진 사용자를 찾지 못했습니다.") as CustomError;
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("패스워드가 맞지 않습니다.") as CustomError;
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        `${AUTH_SECRET}`,
        { expiresIn: "1h" },
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
