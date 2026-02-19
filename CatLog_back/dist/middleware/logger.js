export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    console.log(`[${timestamp}] ${method} ${path}`);
    if (Object.keys(req.body).length > 0) {
        console.log(`  Body:`, req.body);
    }
    if (Object.keys(req.query).length > 0) {
        console.log(`  Query:`, req.query);
    }
    const originalSend = res.send;
    res.send = function (data) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${method} ${path} - Status: ${res.statusCode}`);
        if (data && typeof data === "object") {
            console.log(`  Response:`, JSON.stringify(data).substring(0, 200));
        }
        return originalSend.call(this, data);
    };
    next();
};
