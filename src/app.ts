import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "This is the Root Route " });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
