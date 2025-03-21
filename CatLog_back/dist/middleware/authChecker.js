const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("인증에 실패했습니다.");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "somesupersecretsecret");
    }
    catch (err) {
        err.statusCode = 500;
        next(err);
    }
    if (!decodedToken) {
        const error = new Error("인증에 실패했습니다.");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
export {};
