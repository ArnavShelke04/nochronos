import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
const router = express.Router();


router.route('/login').post(loginUser)
router.route('/register').post(registerUser)

export default router;