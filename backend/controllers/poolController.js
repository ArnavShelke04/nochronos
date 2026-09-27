import { Pool } from "../models/Pool.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPool = asyncHandler(async (req, res) => {
  const { name, subscription, maxMembers, renewalDay, currency } = req.body;
  
  if (!name || !subscription || !maxMembers || !renewalDay) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Check if pool name is unique
  const existingPool = await Pool.findOne({ name: name.trim() });
  if (existingPool) {
    throw new ApiError(400, "Pool name already taken. Please choose another one.");
  }

    const userId = req.user._id;

    // Create the pool
    const newPool = new Pool({
      name: name.trim(),
      subscription,
      maxMembers,
      renewalDay,
      currency: currency || "USD",
      author: userId,
      members: [userId],
      status: "Active"
    });

    await newPool.save();

  // Add pool to user's joinedPools
  await User.findByIdAndUpdate(userId, {
    $push: { joinedPools: newPool._id }
  });

  return res.status(201).json(new ApiResponse(201, { pool: newPool }, "Pool created successfully"));
});

export const searchPools = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(200).json(new ApiResponse(200, [], "Empty query"));
  }

  const pools = await Pool.find({
    name: { $regex: query, $options: "i" }
  })
  // 1. Added author and renewalDay to the select list
  .select("name subscription maxMembers currency members author renewalDay")
  // 2. POPULATE the author so React can actually render author.name and author.avatar
  .populate("author", "name avatar") 
  .limit(10);

  console.log("2. Mongoose found pools:", pools);
  return res.status(200).json(new ApiResponse(200, pools, "Pools fetched successfully"));
});
