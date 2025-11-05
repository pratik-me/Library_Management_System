import { generateVerificationOTPTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOTPTemplate(verificationCode);
        sendEmail({
            email,
            subject : "Verification Code for LMS",
            message,
        });
        res.status(200).json({
            success : true,
            message : "Veriffcation code sent successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "verification code failed to send.",
            error,
        })
        
    }
}