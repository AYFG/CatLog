import { NextFunction, Request, Response } from "express";
import Cat from "../models/cat.js";
import DailyLog from "../models/dailyLog.js";
import { CustomError } from "../types/error.js";

export const createDailyLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { catId } = req.params;

    const { defecation, vitamin, weight, etc, logDate, cat } = req.body;
    const { catName } = cat;

    if (defecation === undefined || vitamin === undefined || !weight || !logDate) {
      const error = new Error("필수 입력값이 누락되었습니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    let dailyLog = await DailyLog.findOne({ "cat.catId": catId, logDate: req.body.logDate });

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
    console.log(cats);
    if (!cats) {
      const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      ok: 1,
      message: "일일 건강기록을 성공적으로 가져왔습니다.",
      dailyLogs: cats.map((cat) => cat.dailyLogs).flat(),
    });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getDailyLogDates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const error = new Error("사용자 ID가 필요합니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const cats = await Cat.find({ owner: userId }).populate<{ dailyLogs: { logDate: String }[] }>({
      path: "dailyLogs",
      select: "logDate -_id",
    });
    if (!cats) {
      const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    const everyLogDates = cats
      .map((cat) => cat.dailyLogs)
      .flat()
      .map((log) => log.logDate);

    res.status(200).json({
      ok: 1,
      message: "모든 일일 기록 날짜를 성공적으로 가져왔습니다.",
      everyLogDates,
    });
  } catch (err) {
    const error = err as CustomError;
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteDailyLog = async (req: Request, res: Response, next: NextFunction) => {
  const { dailyLogId } = req.params;

  if (!dailyLogId) {
    const error = new Error("삭제할 일일 기록을 찾을 수 없습니다.") as CustomError;
    error.statusCode = 404;
    throw error;
  }
  await DailyLog.findByIdAndDelete(dailyLogId);

  res.status(200).json({ ok: 1, message: "일일기록을 성공적으로 제거했습니다." });
};
