import { Router } from "express";
import { verifyToken } from "../lib/jwtTokens.js";
import { chatCompletionValidator, validate } from "../lib/validators.js";
import {
  chatCompletion,
  deleteChat,
  sendChatsToUser,
} from "../controllers/chat.js";

const chatRouter = Router();
chatRouter.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  chatCompletion
);

chatRouter.get("/all-chats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChat);
export default chatRouter;
