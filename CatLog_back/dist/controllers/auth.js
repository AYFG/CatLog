import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
export const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const error = new Error("검증 실패");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
        });
        return user.save();
    })
        .then((result) => {
        res.status(201).json({ message: "유저 생성 성공", userId: result._id });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
