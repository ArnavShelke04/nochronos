import express from "express";
import { createPool, searchPools, createDepositSession, getDepositQRCode } from "../controllers/poolController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Secured routes
router.route("/create").post(verifyJWT, createPool);
router.route("/search").get(verifyJWT, searchPools);

// Ledger & Payment Routes
router.route("/:poolId/deposit").post(verifyJWT, createDepositSession);
router.route("/:poolId/deposit/qrcode").get(verifyJWT, getDepositQRCode);

export default router;
