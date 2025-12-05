import { User } from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailer/emails.js";
import { randomBytes } from "crypto";

export const signup = async (req, res) => {
    const {email, password, name} = req.body;

    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationCode();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000// 24 hours
        })

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        return res.status(400).json({success:false, message: error.message});
    }
}

export const delUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({email});
        console.log(`User with email ${user.email} and name ${user.name} Deleted successfully`);
        res.json(`User with email ${user.email} and name ${user.name} Deleted successfully`)
        
    } catch (error) {
        res.json("Error whiles deleting", error.message)
    }
}

export const verifyEmail = async (req, res) => {
    const { verifyToken } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: verifyToken,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code" })
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name, `${process.env.CLIENT_URL}/login` );

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password"});
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({success: false, message: error.message})
    }
}
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully"})
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if(!user){
            res.status(400).json({success: false, message: "User not found"})
        }

        // Generate reset token
        const resetToken = randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;// 1 Hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
        
    } catch (error) {
        console.log("Error in  forgot-password", error)
        res.status(400).json({success: false, message: error.message});
        
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token "});
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" })
        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        
    }
}

export const checkauth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found"});
        }
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("CheckAuth error", error);
        res.status(400).json({ success: false, message: error.message});

    }
}