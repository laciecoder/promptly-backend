import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();
app.use(cors({ credentials: true, origin: "https://promptly-frontend-pi.vercel.app" }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
app.use("/api/v1", router);

export { app };
