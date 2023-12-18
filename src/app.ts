import express, { type Request, type Response } from "express";
import todos from "./routes/todos.js";
import authRouter from "./routes/auth.js";
import { notFound } from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/error-handler.js";
import authenticateUser from "./middlewares/authentication.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();

/**
 * The port on which the server will listen.
 * If the 'PORT' environment variable is set, its value will be used;
 * otherwise, it defaults to 6000.
 */
const port = process.env.PORT ?? 6000;

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Todo Api" });
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/todos", authenticateUser, todos);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}.....`);
});

export default app;
