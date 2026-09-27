import express from "express";
import { createPool, searchPools } from "../controllers/poolController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Secured routes
router.route("/create").post(verifyJWT, createPool);
router.route("/search").get(verifyJWT, searchPools);

export default router;
