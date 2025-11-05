import { catchAsyncErrors } from "../Middlewares/catchAsyncError.js";
import ErrorHandler from "../Middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../models/index.js"
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { Op } from "sequelize";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordTemplate } from "../utils/emailTemplates.js";

const User = db.user;

export const Register = catchAsyncErrors(async (req, res, next) => {
    if (!req.body) next(new ErrorHandler("Can't able to find req body.", 400));
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return next(new ErrorHandler("Please enter all fields.", 400))

    const isRegistered = await User.findOne({ where: { email, accountVerified: true } });
    if (isRegistered) return next(new ErrorHandler("User already exist.", 400));

    const registrationAttemptByUser = await User.findAll({
        where: { email, accountVerified: false },
    })
    if (registrationAttemptByUser.length >= 5) {
        return next(new ErrorHandler("You have exceeded the number of registration attempts. Please try again later", 400))
    }

    if (password.length <= 6 || password.length >= 20) {
        return next(new ErrorHandler("Password must be between 6 and 20 characters.", 400));
    }

    const hassedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name, email, password: hassedPassword,
    })
    const verificationCode = user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, email, res);
})

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) next(new ErrorHandler("Email or otp is missing.", 400));
    try {
        const userAllEntries = await User.findAll({
            where: {
                email: email,
                accountVerified: false,
            },
            order: [
                ['createdAt', 'DESC']              // Sort by the 'createdAt' column in DESCending order
            ]
        });
        let user = userAllEntries[0], currentTime = Date.now();
        // console.log("user has been created having value : \n", user, "And value of userAllEntries is :\n", userAllEntries);                                                                                     //
        if (!userAllEntries) return next(new ErrorHandler("User not found.", 404));

        if (userAllEntries.length > 1) {
            // console.log("Removing redundant entries");                                                    //
            await User.destroy({
                where: {
                    id: { [Op.ne]: user.id },
                    email,
                    accountVerified: false,
                }
            });
        }

        // console.log("Value of verificationCode is : ", user.verificationCode, "\nValue of OTP is : ", Number(otp));    //

        const verificationCodeExpire = new Date(user.verificationCodeExpires).getTime();
        // console.log("Value of user.verificationCodeExpires : ", user.verificationCodeExpires)                          //

        if (user.verificationCode !== Number(otp)) return next(new ErrorHandler("Invalid OTP.", 400));
        // console.log("OTP verification passed");                                                                        //
        if (currentTime > verificationCodeExpire) return next(new ErrorHandler("OTP Expired.", 400));
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        // console.log("Value of user.changed : ", user.changed());                                                       //
        await user.save({fields : user.changed()});       // user.changed() stores all the fields that are changed

        sendToken(user, 200, "Account Verified", res);
 
    } catch (error) {
        return next(new ErrorHandler(`Internal server Error.\n${error}`, 500))
    }
})

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password)
        return next(new ErrorHandler("Please enter all fields", 400));

    const user = await User.findOne({
        where : {
            email,
            accountVerified : true,
        }, 
        attributes : {
            include : ['password'],          // Now this will allow use to get user.password
        }
    })
    if(!user) return next(new ErrorHandler("Invalid email or password.", 400));
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 400));

    sendToken(user, 200, "User logged in successfully", res);
})

export const logout = catchAsyncErrors(async (req, res, next) => {
    console.log("Logout is called");
    const pastDate = new Date(Date.now());
    res.status(200).cookie("token", "", {
        expires : pastDate,
        httpOnly : true,
    }).json({
        success : true,
        message : "Logged out successfully.",
    });
})

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success : true,
        user,
    })
})

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if(!req.body.email) return next(new ErrorHandler("Email is required.", 400));
    const user = await User.findOne({
        where : {
            email : req.body.email,
            accountVerified : true,
        }
    });
    if(!user) return next(new ErrorHandler("Invalid email", 400));
    const resetToken = user.getResetPasswordToken();

    await user.save({validate : false});           // Used to skip validation when saving a record.

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = generateForgotPasswordTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email : user.email,
            subject : "LMS Password Recovery",
            message,
        })

        res.status(200).json({
            success : true,
            message : `Email sent successfully to ${user.email} successfully.`
        })
    } catch (error) {
        // Let resetPasswordToken and resetPasswordExpire be undefined so that they can be ignored during user.save()
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validate : false});
        return next(new ErrorHandler(error.message, 500));
        
    }
})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        where : {
            resetPasswordToken,
            resetPasswordExpire : {[Op.gt] : Date.now()},
        }
    });
    if(!user) return next(new ErrorHandler(`Reset password token is invalid or has been expired.`, 400));

    if(req.body.password !== req.body.confirmPassword) return next(new ErrorHandler("Wrong confirmation password", 400));
    if(req.body.password.length < 8 || req.body.password.length > 16 || req.body.confirmPassword.length < 8 || req.body.confirmPassword.length > 16)
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    console.log("New Password : ", hashedPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, "Password reset successfully", res);
})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
        attributes : {
            include : ['password'],          // Now this will allow use to get user.password
        }
    });

    const {currentPassword, newPassword, confirmNewPassword} = req.body;
    if(!currentPassword || !newPassword || !confirmNewPassword) return next(new ErrorHandler("Please enter all fields.", 400));

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordMatched) return next(new ErrorHandler("Current password is incorrect.", 400));

    if(newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16)
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));

    if(newPassword !== confirmNewPassword) return next(new ErrorHandler("New Password and confirm password didn't match.", 400));

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success : true,
        message : "Password updated successfully"
    })
})

