import { Router } from "express";
import userRouter from "./userRouter.js";
import chatRouter from "./chatRouter.js";

const router = Router();

router.use("/user", userRouter);
router.use("/chats", chatRouter);

export default router;