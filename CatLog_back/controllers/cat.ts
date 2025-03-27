import { NextFunction, Request, Response } from "express";

import Cat from "../models/cat.js";
import User from "../models/user.js";
import { CustomError } from "../types/error.js";

export const createCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, birthDate, owner } = req.body;

    if (!name || !birthDate) {
      const error = new Error("필수 입력값이 누락되었습니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const cat = new Cat({
      name,
      birthDate,
      owner,
    });
    await cat.save();

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    user.cats.push(cat._id);
    await user.save();

    res.status(201).json({
      message: "고양이가 성공적으로 등록되었습니다.",
      cat,
    });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = 500;
    next(error);
  }
};
