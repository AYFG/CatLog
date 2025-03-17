import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/error.js";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.statusCode || 500;
  const message = error.message || "서버 오류가 발생했습니다.";

  res.status(status).json({
    ok: 0,
    message: message,
    data: error.data,
  });
};
