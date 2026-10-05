import { Pool } from "../models/Pool.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import QRCode from "qrcode";
import { Transaction } from "../models/Transaction.js";
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

export const createDepositSession = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { poolId } = req.params;
  const { amount } = req.body; 
  const userId = req.user._id.toString();

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  const pool = await Pool.findById(poolId);
  if (!pool) {
    throw new ApiError(404, "Pool not found");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: pool.currency.toLowerCase() || "usd",
          product_data: {
            name: `Deposit to ${pool.name} Wallet`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/pools/${poolId}?deposit=success`,
    cancel_url: `${process.env.FRONTEND_URL}/pools/${poolId}?deposit=canceled`,
    metadata: {
      poolId: pool._id.toString(),
      userId: userId,
    },
  });

  return res.status(200).json(new ApiResponse(200, { url: session.url }, "Checkout session created"));
});

export const getDepositQRCode = asyncHandler(async (req, res) => {
  const { poolId } = req.params;
  const amount = req.query.amount || 10;
  
  const pool = await Pool.findById(poolId);
  if (!pool) {
    throw new ApiError(404, "Pool not found");
  }

  const depositUrl = `${process.env.FRONTEND_URL}/pools/${poolId}/deposit?amount=${amount}`;
  
  const qrCodeDataUri = await QRCode.toDataURL(depositUrl, {
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  
  return res.status(200).json(new ApiResponse(200, { qrCode: qrCodeDataUri }, "QR Code generated"));
});

export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { poolId, userId } = session.metadata;
    const amount = session.amount_total / 100;

    try {
      await Transaction.create({
        poolId,
        userId,
        amount,
        type: "DEPOSIT",
      });

      await Pool.findByIdAndUpdate(poolId, {
        $inc: { walletBalance: amount }
      });
      console.log(`Successfully deposited $${amount} into Pool ${poolId}`);
    } catch (dbError) {
      console.error("Database error during webhook processing:", dbError);
    }
  }

  res.status(200).send();
};
