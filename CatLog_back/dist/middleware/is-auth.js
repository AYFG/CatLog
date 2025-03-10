// import jwt from "jsonwebtoken";
// import "dotenv/config";
// import { Request, Response, NextFunction } from "express";
export {};
// const verify = jwt;
// const AUTH_SECRET = process.env.AUTH_SECRET as string;
// interface CustomRequest extends Request {
//   userId?: string;
// }
// interface CustomError extends Error {
//   statusCode?: number;
// }
// export default (req: CustomRequest, res: Response, next: NextFunction): void => {
//   const authHeader = req.get("Authorization");
//   if (!authHeader) {
//     const error: CustomError = new Error("인증에 실패했습니다.");
//     error.statusCode = 401;
//     throw error;
//   }
//   const token = authHeader.split(" ")[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, AUTH_SECRET);
//   } catch (err) {
//     const error = err as CustomError;
//     error.statusCode = 500;
//     throw error;
//   }
//   if (!decodedToken || typeof decodedToken === "string") {
//     const error: CustomError = new Error("인증에 실패했습니다.");
//     error.statusCode = 401;
//     throw error;
//   }
//   req.userId = decodedToken.userId;
//   next();
// };
