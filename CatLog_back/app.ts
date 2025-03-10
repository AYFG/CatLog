import express, { Request, Response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
const DATABASE_ID = process.env.DATABASE_ID;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT;

const MongoDB_URI = `mongodb+srv://${DATABASE_ID}:${DATABASE_PASSWORD}@cluster0.xupmv.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!!");
});

app.use("/auth", authRoutes);

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
