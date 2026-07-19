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
        res.send(error)
    }

}


const loginUser = async (req,res) =>{
    const {name, password, email} = req.body;
    if(!name){
        res.status(401).send("Invalid name");
    }
    const user = await User.findOne({name})
    if(!user){
        res.status(404).send("No user exists")
    }
    const isValidPassword = await user.comparePassword(password);
    if(!isValidPassword) {
        res.status(400).send("Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id);

    const loggedInUser = await User.findById(user.id).select(-password -refreshToken);

    const options = {
        httpOnly : true,
        secure : true
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        user: loggedInUser , accessToken , refreshToken
    })
}

const logoutUser = async (req,res)=>{

}
const registerUser = async (req,res)=>{

}
export {
    loginUser,
    logoutUser,
    registerUser
}