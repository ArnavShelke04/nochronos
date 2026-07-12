import mongoose from "mongoose";
import { Pool } from "../models/Pool";
import express from 'express';
export const createPool = async (data) => {
    const existingPool = await Pool.findOne({poolName : poolname})
    if(existingPool){
        console.log("Pool Exists!!")
        return null;
    }
    await existingPool.save();
}
