import express, { type Request, type Response } from "express";
import todos from "./routes/todo.js";
import { notFound } from "./middleware/not-found.js";
import { apiKeyMiddleware } from "./middleware/authorization.js";

const app = express();

/**
 * The port on which the server will listen.
 * If the 'PORT' environment variable is set, its value will be used;
 * otherwise, it defaults to 6000.
 */
const port = process.env.PORT ?? 6000;

// middlewares
app.use(apiKeyMiddleware);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to My Todo Api" });
});

// routes
app.use("/api/v1/todos", todos);
app.use(notFound);

app.listen(port, () => {
  console.log(`Listening on port ${port}.....`);
});

export default app;
