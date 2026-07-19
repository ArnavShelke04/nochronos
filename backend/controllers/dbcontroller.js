
import { Pool } from "../models/Pool.js";
import {User} from "../models/User.js"

export const createPool = async (data) => {
    const poolname = data.poolName;
    const existingPool = await Pool.findOne({poolName : poolname})
    if(existingPool){
        console.log("Pool Exists!!")
        return null;
    }
    const newPool = new Pool(data);
    await newPool.save();
    return newPool;
}
export const createUser = async (data) => {
    const Name = data.name;
    const existingUser = await User.findOne({name : Name})
    if(existingUser){
        console.log("User Exists!!")
        return null;
    }
    const newUser = new User(data);
    await newUser.save();
    return newUser;
}
