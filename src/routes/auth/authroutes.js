import express from "express";
import {
  login,
  register,
  verify,
  getUserProfile,
  logout,
} from "../../controllers/auth/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleWare.js";

const authRouter = express.Router(); 


authRouter.route("/register").post(register); 
authRouter.route("/verify/:token").get(verify); 
authRouter.route("/login").post(login); 
authRouter.route("/profile").get(authenticateToken, getUserProfile); 
authRouter.route("/logout").post(logout); 

export default authRouter; 
