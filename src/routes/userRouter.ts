import { Router } from "express";
import { createUser, getAllUsers, loginUser, logoutUser, verifyUser } from "../controllers/user.js";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../lib/validators.js";
import { verifyToken } from "../lib/jwtTokens.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", validate(signupValidator), createUser);
userRouter.post("/login", validate(loginValidator), loginUser);
userRouter.get("/auth-status", verifyToken, verifyUser);
userRouter.get("/logout", verifyToken, logoutUser);

export default userRouter;
