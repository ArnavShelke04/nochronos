import express from 'express';
import { createUser } from '../controllers/dbcontroller.js';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
const router = express.Router();


router.route('/login').post(loginUser)

export default router;