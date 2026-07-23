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
    try {
        const {email,password} = req.body;
        if(!email){
           return res.status(401).json({message :"Invalid email"});
        }
        const user = await User.findOne({email}).select(`+password`)
        if(!user){
            return res.status(404).json({
                message : "No user found"
            })
        }
        const isValidPassword = await user.comparePassword(password);
        if(!isValidPassword) {
            return res.status(400).json({message :"Invalid Password"});
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id);
    
        const loggedInUser = await User.findById(user.id).select("-password -refreshToken");
    
        const options = {
            httpOnly : true,
            secure : true
        }
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            user: loggedInUser , accessToken , refreshToken
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message :"error",error
        });
    }
}

const logoutUser = async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )
    const options ={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
        message : "logged out successfully"
    })

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
const getMe = ()=>{

}
const refreshAccessToken = async(req,res)=>{
    const userRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if(!userRefreshToken){
        return res.status(400).json({
            message : "Invalid Refresh Token"
        })
    }
    const decodedToken = jwt.verify(refreshToken,REFRESH_SECRET_KEY);
    const user = await User.findById(decodedToken._id).select("-password");
    if(!user){
        return res.status(401).json({
            message : "Invalid User"
        })
    }
    if(decodedToken !== user.refreshToken){
        return res.status(402).json({
            message : "Token Expired , login again"
        })
    }
    const options = {
        httpOnly : true,
        secure :true
    }
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    return res.
    status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json({
        accessToken, refreshToken : newRefreshToken, message : "refresh successful"
    })
}
export {
    loginUser,
    logoutUser,
    registerUser,
    getMe
}