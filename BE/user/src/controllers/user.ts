import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";
import { AuthenticatedRequest } from '../middleware/isAuth.js'

export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:rateLimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
       return res.status(429).json({
            message: 'Too many requests. Please wait a minute before requesting new OTP'
        })
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, OTP, {
        EX: 300
    });
    await redisClient.set(rateLimitKey, "true", {
        EX: 60
    });
    const message = {
        to: email,
        subject: "Chat APP: Your OTP code",
        body: `Your login verification OTP code is : ${OTP}. Vaild only for 5 minutes`
    }
    await publishToQueue("send-otp", message)
    res.status(200).json({
        message: "OTP is successfully sent to your email"
    })
})

export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp: enteredotp } = req.body;
    if (!email || !enteredotp) {
        res.status(400).json({
            message: `Email and OTP required`,
        })
        return;
    }
    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || storedOtp !== enteredotp) {
        res.status(400).json({
            messsage: `Invalid or expired OTP`
        })
        return;
    }
    await redisClient.del(otpKey);
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, 8);
        user = await User.create({ name, email });
    }
    const token = generateToken(user)
    res.json({
        message: "User is Verified",
        user,
        token
    })
})

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.json(user)
})

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { updatedName } = req.body;
    const user = await User.findById(req.user?._id)
    if(!user){
        res.status(401).json({
            message:"User Not Found",
        });
        return;
    };
    user.name=updatedName
    await user.save();
    const token = generateToken(user);
    res.status(200).json({
        message:'User Updated',
        user,
        token
    })
})
export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
    const users = await User.find();
    res.json(users);
})
export const getAUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
    const users = await User.findById(req.params.id);
    res.json(users);
})