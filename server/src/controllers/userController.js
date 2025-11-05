import { catchAsyncErrors } from "../Middlewares/catchAsyncError.js";
import ErrorHandler from "../Middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import db from "../models/index.js";

const User = db.user;

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.findAll({
        where : {
            accountVerified : true,
        }
    });
    res.status(200).json({
        success : true,
        users,
    })
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) return next(new ErrorHandler("Please fill all fields."));

    const isRegistered = await User.findOne({
        where : {
            email,
            accountVerified : true,
        }
    });
    if(isRegistered) return next(new ErrorHandler("User is already registered.", 400));
    if(password.length > 16 || password.length < 8) return next(new ErrorHandler("Password must be betweeen 8 and 16 characters."));

    const hassedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name, 
        email,
        password : hassedPassword,
        role : "Admin", 
        accountVerified : true,           // No need to verify if Admin is adding the account
    });

    res.status(201).json({
        success : true,
        message : "Admin registered successfully",
        admin,
    })
})