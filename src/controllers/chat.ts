import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../models/User.js";
import OpenAI from "openai";
import { CreateChatCompletionRequestMessage } from "openai/src/resources/index.js";

export const chatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).json({ message: "User not registered or malfunctioned" });
      return;
    }
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as CreateChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });
    const ai = new OpenAI({
      apiKey: process.env.OPEN_AI_SECRET,
      organization: process.env.OPEN_AI_ORG_ID,
    });
    console.log(chats);
    const chatResponse = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chats,
    });
    console.log(chatResponse.choices[0].message);
    user.chats.push({
      content: chatResponse.choices[0].message.content,
      role: "assistant",
    });
    await user.save();
    res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User Does not exist or token malfunction");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    res.status(200).json({ message: "ok", chats: user.chats });
  } catch (error) {
    res.status(400).json({ message: "bad request", error: error.message });
  }
};

export const deleteChat: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User Does not exist or token malfunction");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(400).json({ message: "bad request", error: error.message });
  }
};
