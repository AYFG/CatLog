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

    res.status(201).json({ ok: 1, message: "고양이가 성공적으로 등록되었습니다.", cat });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = 500;
    next(error);
  }
};
export const getCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("cats");

    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ ok: 1, message: "고양이 목록을 성공적으로 가져왔습니다.", cats: user.cats });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
export const updateCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const catId = req.params.catId;
    const { name, birthDate } = req.body;

    if (!name || !birthDate) {
      const error = new Error("필수 입력값이 누락되었습니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const cat = await Cat.findById(catId);
    if (!cat) {
      const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    cat.name = name;
    cat.birthDate = birthDate;
    await cat.save();

    res.status(201).json({ ok: 1, message: "고양이의 정보를 성공적으로 수정했습니다.", cat });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteCat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const catId = req.params.catId;
    const cat = await Cat.findById(catId);
    const user = await User.findById(req.userId);
    if (!cat) {
      const error = new Error("삭제할 고양이를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      error.message = "삭제할 고양이를 찾을 수 없습니다.";
      throw error;
    }
    if (!user || cat.owner.toString() !== user._id.toString()) {
    }
    await Cat.findByIdAndDelete(catId);

    if (user) {
      user.cats = user.cats.filter((id) => id.toString() !== catId);
      await user.save();
    }
    res.status(200).json({ ok: 1 });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
