import { type Request, type Response, type NextFunction } from "express";

/**
 * Middleware to check API key in the "Authorization" header.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const apiKey = req.get("Authorization");
  if (apiKey !== "Bearer abc123xyz456") {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};
