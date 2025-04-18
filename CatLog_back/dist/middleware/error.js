export const errorHandler = (error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "서버 오류가 발생했습니다.";
    const errorName = error.name || "InternalServerError";
    res.status(status).json({
        ok: 0,
        message: message,
        data: error.data,
        errorName: errorName,
    });
};
