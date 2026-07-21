import express from 'express';
import { messageRead } from '../controllers/inboxController.js';
const router = express.Router();

router.route("/:message_id").patch(messageRead);

export default router;