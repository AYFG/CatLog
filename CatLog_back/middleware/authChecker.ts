import { CustomError } from "../types/error.js";
import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET;

export const authChecker = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("인증에 실패했습니다.") as CustomError;
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    if (!AUTH_SECRET) {
      throw new Error("서버 에러") as CustomError;
    }
    decodedToken = jwt.verify(token, AUTH_SECRET);
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = 500;
    if (error.message === "jwt expired") {
      error.statusCode = 401;
      error.message = "토큰이 만료되었습니다.";
      return next(error);
    }
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error("인증에 실패했습니다.") as CustomError;
    error.statusCode = 401;
    throw error;
  }
  if (typeof decodedToken === "object") {
    req.userId = decodedToken.userId;
  }
  next();
};
