import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
import transporter from "./nodemailer.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email;

    try {
        const response = await transporter.sendMail({
            from:process.env.BREVO_SENDER_EMAIL,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        return ("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending verification", error);
        return ({  success: false, message: error.message})
        //throw new Error(`Error sending verification email: ${error}`);
        
        
    }
}

export const sendWelcomeEmail = async (email, userName, loginUrl) => {
    const recipient = email;

    try {
        const response = await transporter.sendMail({
            from:process.env.BREVO_SENDER_EMAIL,
            to: recipient,
            subject: "Welcome",
            html: WELCOME_EMAIL_TEMPLATE.replace("{loginURL}", loginUrl).replace("userName", userName),
            category: "Welcome Email"
        })
        
        return ("Welcome Email sent successfully");
    } catch (error) {
        console.error("Error sending welcome", error);
        throw new Error(`Error sending Welcome email: ${error}`);
        
        
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = email;

    try {
        const response = await transporter.sendMail({
            from:process.env.BREVO_SENDER_EMAIL,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        });
        return ({success: true, response});
    } catch (error) {
        return ({success: false, message: error.message})
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = email;

    try {
        const response = await transporter.sendMail({
            from:process.env.BREVO_SENDER_EMAIL,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });
        return ("Password reset email sent successfully");
    } catch (error) {
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}