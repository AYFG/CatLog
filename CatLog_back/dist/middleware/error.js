export const errorHandler = (error, req, res, _next) => {
    const status = error.statusCode || 500;
    const message = error.message || "서버 오류가 발생했습니다.";
    const errorName = error.name || "InternalServerError";
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${req.method} ${req.path} - Status: ${status} - ${errorName}: ${message}`);
    if (error.stack) {
        console.error(`  Stack:`, error.stack);
    }
    res.status(status).json({
        ok: 0,
        message: message,
        data: error.data,
        name: errorName,
    });
};
