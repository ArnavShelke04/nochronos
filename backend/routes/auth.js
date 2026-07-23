import express from 'express';
import { loginUser, logoutUser, registerUser, getMe } from '../controllers/userController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
const router = express.Router();



router.route('/login').post(loginUser)
router.route('/register').post(registerUser)

//secured routes
router.route('/me').get(getMe)
router.route('/logout').post(verifyJWT, logoutUser)

export default router;