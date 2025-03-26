import { CustomError } from "../types/error.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET;
module.exports = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("인증에 실패했습니다.") as CustomError;
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  //   try {
  //     if (!AUTH_SECRET) {
  //       throw new Error("인증에 실패했습니다.") as CustomError;
  //     }
  //     decodedToken = jwt.verify(token, AUTH_SECRET);
  //   } catch (err) {
  //     err.statusCode = 500;
  //     next(err);
  //   }
  //   if (!decodedToken) {
  //     const error = new Error("인증에 실패했습니다.") as CustomError;
  //     error.statusCode = 401;
  //     throw error;
  //   }
  //   req.userId = decodedToken.userId;
  //   next();
};
