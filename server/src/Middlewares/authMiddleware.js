import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.user;

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) return next(new ErrorHandler("User is not Authenticated,", 400));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);                                          // Debugging
    req.user = await User.findByPk(decoded.id);
    next();
})

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if(!roles.includes(req.user.role))
            return next(new ErrorHandler(`User with this role '${req.user.role}' is not allowed to access this resource.`, 400));
        next();
    }
}