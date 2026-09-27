import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";

import redis from "./config/redis.js";
import { Pool } from "./models/Pool.js";
import { Message } from "./models/Message.js";
import { User } from "./models/User.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import inboxRoutes from "./routes/inbox.js";
import poolRoutes from "./routes/pools.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/auth", authRoutes);
app.use("/inbox", inboxRoutes);
app.use("/api/pools", poolRoutes);

// Routes
app.get("/homepage/:id", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});

app.post("/homepage/:id", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start the server with app.listen, then attach socket.io to it
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io for live pool chat
io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);

  socket.on("join_pool", async (poolId) => {
    socket.join(poolId);
    console.log(`User ${socket.id} joined pool: ${poolId}`);
    
    try {
      const messages = await Message.find({ groupId: poolId, type: "chat" })
        .sort({ createdAt: 1 })
        .populate("author", "name")
        .limit(100);
        
      const formattedMessages = messages.map(m => ({
        poolId: String(m.groupId),
        sender: m.author?.name || "Unknown",
        senderId: String(m.author?._id || ""),
        message: m.content,
        timestamp: m.createdAt
      }));
      
      socket.emit("chat_history", formattedMessages);
    } catch (err) {
      console.error("Error fetching chat history:", err);
      socket.emit("chat_history", []);
    }
  });

  socket.on("send_message", async (data) => {
    console.log("Received send_message:", data);
    
    if (!data.poolId || !data.message || !data.senderId) {
      console.error("Invalid message data:", data);
      return;
    }

    try {
      const newMsg = new Message({
        type: "chat",
        groupId: data.poolId,
        author: data.senderId,
        content: data.message
      });
      await newMsg.save();
      console.log("Message saved to DB");
      
      // Broadcast to everyone in the pool room (including sender)
      io.to(data.poolId).emit("receive_message", {
        poolId: data.poolId,
        sender: data.sender,
        senderId: String(data.senderId),
        message: data.message,
        timestamp: newMsg.createdAt
      });
    } catch (err) {
      console.error("Error saving message:", err.message, err.errors);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
