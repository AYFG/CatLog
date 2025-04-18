import { validationResult, ValidationError } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { ObjectId } from "mongodb";
import { CustomError } from "../types/error.js";

const AUTH_SECRET = process.env.AUTH_SECRET;
const AUTH_REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET;

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
    const error = new Error("회원가입에 실패했습니다.") as CustomError;
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
      res.status(201).json({ ok: 1, message: "유저 생성 성공", userId: result._id });
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
      const accessToken = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        `${AUTH_SECRET}`,
        // { expiresIn: "1d" },
        { expiresIn: "1m" }, // refresh token 발급 로직 작성을 위해 1분으로 임시 설정
      );
      const refreshToken = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        `${AUTH_REFRESH_SECRET}`,
        // { expiresIn: "7d" },
        { expiresIn: "1m" }, // refresh Token 마저 만료되었을 때를 가정해 1분으로 임시 설정
      );

      if (!AUTH_REFRESH_SECRET) {
        throw new Error("AUTH_REFRESH_SECRET is not defined.");
      }

      loadedUser.refreshToken = refreshToken;
      loadedUser.save();

      res.status(200).json({
        ok: 1,
        item: {
          message: "유저 로그인 성공",
          accessToken: accessToken,
          refreshToken: refreshToken,
          userId: loadedUser._id.toString(),
          email: loadedUser.email,
          name: loadedUser.name,
        },
      });
    })
    .catch((err) => {
      if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
      }
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      const error = new Error("refresh token이 없습니다.") as CustomError;
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      const error = new Error(
        "refresh token이 만료되었습니다. 다시 로그인 해주세요",
      ) as CustomError;
      error.statusCode = 401;
      error.name = "RefreshTokenExpired";
      throw error;
    }
    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      `${AUTH_SECRET}`,
      // { expiresIn: "1d" },
      { expiresIn: "1m" }, //refresh Token 만료 테스트를 위한 accessToken 임시 1분 설정
    );
    res.status(200).json({
      ok: 1,
      message: "access token을 재발급했습니다.",
      accessToken: accessToken,
    });
  } catch (err) {
    const error = err as CustomError;

    if (error.name == "TokenExpiredError") {
      const refreshToken = req.body.refreshToken;
      const verifyRefresh = jwt.verify(refreshToken, AUTH_REFRESH_SECRET!);
      error.statusCode = 401;
      console.log("verifyRefresh");
      console.log(verifyRefresh);
      // error.message = "refresh token이 만료되었습니다. 다시 로그인 해주세요";
      // error.name = "RefreshTokenExpired";
      next(error);
    }
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
