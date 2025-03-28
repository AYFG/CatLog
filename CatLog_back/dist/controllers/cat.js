import Cat from "../models/cat.js";
import User from "../models/user.js";
export const createCat = async (req, res, next) => {
    try {
        const { name, birthDate, owner } = req.body;
        if (!name || !birthDate) {
            const error = new Error("필수 입력값이 누락되었습니다.");
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
            const error = new Error("사용자를 찾을 수 없습니다.");
            error.statusCode = 404;
            throw error;
        }
        user.cats.push(cat._id);
        await user.save();
        res.status(201).json({
            message: "고양이가 성공적으로 등록되었습니다.",
            cat,
        });
    }
    catch (err) {
        const error = err;
        error.statusCode = 500;
        next(error);
    }
};
export const getCat = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("cats");
        if (!user) {
            const error = new Error("사용자를 찾을 수 없습니다.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "고양이 목록을 성공적으로 가져왔습니다.",
            cats: user.cats,
        });
    }
    catch (err) {
        const error = err;
        error.statusCode = error.statusCode || 500;
        next(error);
    }
};
