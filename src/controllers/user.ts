import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../lib/jwtTokens.js";

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Ok", users: users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already exists");
      return;
    }
    const hashedPassword = await hash(password, +process.env.HASH_ROUNDS);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      signed: true,
      path: "/",
      domain: process.env.DOMAIN,
      // sameSite: "none",
    });
    const token = createToken(newUser._id.toString(), newUser.email);
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    res.cookie("auth_token", token, {
      path: "/",
      domain: process.env.DOMAIN,
      // sameSite: "none",
      secure: true,
      httpOnly: true,
      expires,
      signed: true,
    });
    res.status(201).json({
      message: "success",
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send("user not registered");
      return;
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(403).send("Incorrect password");
      return;
    }
    // res.clearCookie("auth_token", {
    //   httpOnly: true,
    //   secure: true,
    //   signed: true,
    //   path: "/",
    //   domain: process.env.DOMAIN,
    //   // sameSite: "none",
    // });
    const token = createToken(user._id.toString(), user.email);
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    res.cookie("auth_token", token, {
      path: "/",
      domain: process.env.DOMAIN,
      // sameSite: "none",
      secure: true,
      httpOnly: true,
      expires,
      signed: true,
    });
    res.status(200).json({
      message: "ok",
      name: user.name,
      email: user.email,
      newToken: req.signedCookies["auth_token"],
    });
  } catch (error) {
    res.status(400).json({ message: "bad request", error: error.message });
  }
};

export const verifyUser: RequestHandler = async (
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

    res.status(200).json({ message: "ok", name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ message: "bad request", error: error.message });
  }
};

export const logoutUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("first");
    const user = await User.findById(res.locals.jwtData.id);
    console.log(user);
    if (!user) {
      res.status(401).send("User Does not exist or token malfunction");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    res.clearCookie("auth_token", {
      httpOnly: true,
      signed: true,
      secure: true,
      path: "/",
      domain: process.env.DOMAIN,
      // sameSite: "none",
    });
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(400).json({ message: "bad request", error: error.message });
  }
};
