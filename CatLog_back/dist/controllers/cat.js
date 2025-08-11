import Cat from "../models/cat.js";
import User from "../models/user.js";
import dailyLog from "../models/dailyLog.js";
import medicalLog from "../models/medicalLog.js";
export const createCat = async (req, res, next) => {
    try {
        const { name, birthDate, catType, owner } = req.body;
        if (!name) {
            const error = new Error("이름을 입력해주세요.");
            error.statusCode = 400;
            error.name = "emptyName";
            throw error;
        }
        if (!birthDate) {
            const error = new Error("생일을 입력해주세요.");
            error.statusCode = 400;
            error.name = "emptyBirthday";
            throw error;
        }
        const cat = new Cat({
            name,
            birthDate,
            catType,
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
        res.status(201).json({ ok: 1, message: "고양이가 성공적으로 등록되었습니다.", cat });
    }
    catch (err) {
        const error = err;
        error.statusCode = 500;
        next(error);
    }
};
export const getCat = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            const error = new Error("사용자 ID가 필요합니다.");
            error.statusCode = 400;
            throw error;
        }
        const cats = await Cat.find({ owner: userId }).populate("medicalLogs");
        if (!cats) {
            const error = new Error("고양이를 찾을 수 없습니다.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ ok: 1, message: "고양이 목록을 성공적으로 가져왔습니다.", cats: cats });
    }
    catch (err) {
        const error = err;
        error.statusCode = error.statusCode || 500;
        next(error);
    }
};
export const updateCat = async (req, res, next) => {
    try {
        const catId = req.params.catId;
        const { name, birthDate, catType } = req.body;
        if (!name) {
            const error = new Error("이름을 입력해주세요.");
            error.statusCode = 400;
            error.name = "emptyName";
            throw error;
        }
        if (!birthDate) {
            const error = new Error("생일을 입력해주세요.");
            error.statusCode = 400;
            error.name = "emptyBirthday";
            throw error;
        }
        const cat = await Cat.findById(catId);
        if (!cat) {
            const error = new Error("고양이를 찾을 수 없습니다.");
            error.statusCode = 404;
            throw error;
        }
        cat.name = name;
        cat.birthDate = birthDate;
        cat.catType = catType;
        await cat.save();
        await dailyLog.updateMany({ "cat.catId": catId }, { $set: { "cat.catName": name } });
        await medicalLog.updateMany({ "cat.catId": catId }, { $set: { "cat.catName": name } });
        res.status(201).json({ ok: 1, message: "고양이의 정보를 성공적으로 수정했습니다.", cat });
    }
    catch (err) {
        const error = err;
        error.statusCode = error.statusCode || 500;
        next(error);
    }
};
export const deleteCat = async (req, res, next) => {
    try {
        const catId = req.params.catId;
        const cat = await Cat.findById(catId);
        const user = await User.findById(req.userId);
        if (!cat) {
            const error = new Error("삭제할 고양이를 찾을 수 없습니다.");
            error.statusCode = 404;
            error.message = "삭제할 고양이를 찾을 수 없습니다.";
            throw error;
        }
        if (!user || cat.owner.toString() !== user._id.toString()) {
            const error = new Error("삭제 권한이 없습니다.");
            error.statusCode = 403;
            throw error;
        }
        await medicalLog.deleteMany({ "cat.catId": catId });
        await dailyLog.deleteMany({ "cat.catId": catId });
        await Cat.findByIdAndDelete(catId);
        if (user) {
            user.cats = user.cats.filter((id) => id.toString() !== catId);
            await user.save();
        }
        res.status(200).json({ ok: 1 });
    }
    catch (err) {
        const error = err;
        error.statusCode = error.statusCode || 500;
        next(error);
    }
};
