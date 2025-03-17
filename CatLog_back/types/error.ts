import { ValidationError } from "express-validator";

export interface CustomError extends Error {
  statusCode: number;
  data: ValidationError[];
}
