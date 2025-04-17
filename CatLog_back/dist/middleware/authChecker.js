import jwt from "jsonwebtoken";
const AUTH_SECRET = process.env.AUTH_SECRET;
export const authChecker = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("인증에 실패했습니다.");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        if (!AUTH_SECRET) {
            throw new Error("서버 에러");
        }
        decodedToken = jwt.verify(token, AUTH_SECRET);
    }
    catch (err) {
        const error = err;
        error.statusCode = 500;
        return next(error);
    }
    if (!decodedToken) {
        const error = new Error("인증에 실패했습니다.");
        error.statusCode = 401;
        throw error;
    }
    if (typeof decodedToken === "object") {
        req.userId = decodedToken.userId;
    }
    next();
};
