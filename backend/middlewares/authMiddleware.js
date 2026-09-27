import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")?.replace("Bearer ", "") || "");
    if (!token) {
      return res.status(401).json({
        message: "Unauthorised request",
      });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY, {
      success: true,
    });
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      return res.status(401).json({
        message: " False code ",
      });
    }
    req.user = user; // appending the user to the req , basically work of middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token or unauthorized" });
  }
};

export { verifyJWT };
