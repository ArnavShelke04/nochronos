import jwt from "jsonwebtoken"
import { User } from "../models/User.js";

const verifyJWT = async(req,res,next) =>{
    try {
        const token = req.cookies?.accessToken || req.headers["Authorization"].replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                message : "Unauthorised request"
            })
        }
        const decodedToken = jwt.verify(accessToken,ACCESS_SECRET_KEY,{
            success : true
        })
        const user = await new User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            return res.status(401).json({
                message : " False code "
            })
        }
        req.user = user; // appending the user to the req , basically work of middleware
        next();
    } catch (error) {
        return res.json({message : "error"})
    }
}

export {
    verifyJWT
}