import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import { config } from "./config/config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `${config.BASE_URL}:${config.FRONTEND_PORT}`,
    credentials: true,
    methods: ["POST", "GET", "UPDATE", "DELETE"],
  }),
);

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});
app.use("/api/auth", authRouter);

export default app;
