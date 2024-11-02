import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const createToken = (id: string, email: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies["auth_token"];
  if (!token || token.trim() === "") {
    res.status(401).json({ message: "Token Not received" });
    return;
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        res.status(401).json({ message: "Token Expired" });
        return;
      } else {
        console.log("Token Verified");
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
