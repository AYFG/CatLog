import { NextFunction, Request, Response } from "express";
import MedicalLog from "../models/medicalLog.js";
import Cat from "../models/cat.js";
import User from "../models/user.js";
import { CustomError } from "../types/error.js";

export const createMedicalLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { catId } = req.params;

    const { healthCheckupDate, healthCycle, heartWorm, heartWormCycle, cat } = req.body;
    const { catName } = cat;

    if (!healthCheckupDate || !healthCycle || !heartWorm || !heartWormCycle) {
      const error = new Error("필수 입력값이 누락되었습니다.") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    let medicalLog = await MedicalLog.findOne({ "cat.catId": catId });
    console.log(medicalLog);
    if (medicalLog) {
      medicalLog.healthCheckupDate = healthCheckupDate;
      medicalLog.healthCycle = healthCycle;
      medicalLog.heartWorm = heartWorm;
      medicalLog.heartWormCycle = heartWormCycle;
      await medicalLog.save();
    } else {
      const medicalLog = new MedicalLog({
        cat: {
          catId: catId,
          catName: catName,
        },
        healthCheckupDate,
        healthCycle,
        heartWorm,
        heartWormCycle,
      });
      await medicalLog.save();
      const cat = await Cat.findById(catId);
      if (!cat) {
        const error = new Error("고양이를 찾을 수 없습니다.") as CustomError;
        error.statusCode = 404;
        throw error;
      }
      cat.medicalLogs = medicalLog._id;
      await cat.save();
      console.log("2");
    }

    res.status(201).json({ ok: 1, message: "건강 관리 정보가 등록되었습니다.", medicalLog });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
