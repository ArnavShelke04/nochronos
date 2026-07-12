import mongoose from "mongoose";
import { Pool } from "../models/Pool.js";
import express from 'express';
export const createPool = async (data) => {
    const poolname = data.poolName;
    const existingPool = await Pool.findOne({poolName : poolname})
    if(existingPool){
        console.log("Pool Exists!!")
        return null;
    }
    await existingPool.save();
}
