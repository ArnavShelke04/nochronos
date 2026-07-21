import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


const generateAccessAndRefreshToken = async(id) =>{
    try {
        const user = await User.findById(id);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken,refreshToken};

    } catch (error) {
        return error;
    }

}


const loginUser = async (req,res) =>{
    const {email,password} = req.body;
    if(!email){
        res.status(401).send("Invalid email");
    }
    const user = await User.findOne({email})
    if(!user){
        res.status(404).json({
            message : "No user found"
        })
    }
    const isValidPassword = await user.comparePassword(password);
    if(!isValidPassword) {
        res.status(400).send("Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id);

    const loggedInUser = await User.findById(user.id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        user: loggedInUser , token : accessToken , refreshToken
    })
}

const logoutUser = async (req,res)=>{
    
}
const registerUser = async (req,res)=>{
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({
            message: "Missing name, email, or password fields"
        });
    }

    try {
        const existingUser = await User.findOne({ 
            $or: [{ email }, { name }] 
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or Email already registered !!"
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Registration successful!",
                user: createdUser,
                token: accessToken,
                refreshToken
            });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server registration error" });
    }

}
export {
    loginUser,
    logoutUser,
    registerUser
}