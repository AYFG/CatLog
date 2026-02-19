import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import catRoutes from "./routes/cat.js";
import medicalRoutes from "./routes/medicalLog.js";
import dailyLogRoutes from "./routes/dailyLog.js";
import { errorHandler } from "./middleware/error.js";
import { requestLogger } from "./middleware/logger.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
const DATABASE_ID = process.env.DATABASE_ID;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT;
const MongoDB_URI = `mongodb+srv://${DATABASE_ID}:${DATABASE_PASSWORD}@cluster0.xupmv.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
app.get("/", (_req, res) => {
    res.send("Hello World!!!");
});
app.use("/auth", authRoutes);
app.use("/cat", catRoutes);
app.use("/medicalLog", medicalRoutes);
app.use("/dailyLog", dailyLogRoutes);
app.use(errorHandler);
mongoose
    .connect(MongoDB_URI)
    .then(() => {
    console.log("MongoDB 연결 성공");
    app.listen(PORT, () => {
        console.log(`Client connected`);
    });
})
    .catch((err) => {
    console.error("MongoDB 연결 실패", err);
});
