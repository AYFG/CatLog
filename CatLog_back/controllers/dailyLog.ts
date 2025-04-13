import { NextFunction, Request, Response } from "express";
import DailyLog from "../models/dailyLog.js";
import Cat from "../models/cat.js";
import User from "../models/user.js";
import { CustomError } from "../types/error.js";

export const createDailyLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { catId } = req.params;

    const { defecation, vitamin, weight, etc, logDate, cat } = req.body;
    const { catName } = cat;

    if (!defecation || !vitamin || !weight || !etc || !logDate) {
      const error = new Error("필수 입력값이 누락되었습니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    let dailyLog = await DailyLog.findOne({ "cat.catId": catId, logDate: req.body.logDate });
    console.log(dailyLog);
    if (dailyLog) {
      dailyLog.defecation = defecation;
      dailyLog.vitamin = vitamin;
      dailyLog.weight = weight;
      dailyLog.etc = etc;
      dailyLog.logDate = logDate;
      await dailyLog.save();
    } else {
      const dailyLog = new DailyLog({
        cat: {
          catId: catId,
          catName: catName,
        },
        defecation,
        vitamin,
        weight,
        etc,
        logDate,
      });
      await dailyLog.save();
      const cat = await Cat.findById(catId);
      if (!cat) {
        const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
        error.statusCode = 404;
        throw error;
      }
      cat.dailyLogs.push(dailyLog._id);
      await cat.save();
    }

    res.status(201).json({ ok: 1, message: "건강 관리 정보가 등록되었습니다.", dailyLog });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getDailyLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { logDate } = req.query;
    console.log(logDate);
    if (!logDate) {
      const error = new Error("날짜가 필요합니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }
    const userId = req.userId;
    if (!userId) {
      const error = new Error("사용자 ID가 필요합니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }
    const cats = await Cat.find({ owner: userId }).populate({
      path: "dailyLogs",
      match: { logDate: logDate },
    });
    if (!cats) {
      const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ ok: 1, message: "일일 건강기록을 성공적으로 가져왔습니다.", cats: cats });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
