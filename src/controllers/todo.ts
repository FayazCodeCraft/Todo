import { type NextFunction, type Request, type Response } from "express";
import todoSchema from "../validators/todo.js";
import { createTodoInDB } from "../db/todo.js";
import { asyncWrapper } from "../utility/async-wrapper.js";

/**
 * Create a new Todo by handling a request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
export const createTodo = asyncWrapper(
  async (req: Request, res: Response, nex: NextFunction): Promise<void> => {
    const newTodo = todoSchema.parse(req.body);
    await createTodoInDB(newTodo);
    res.status(201).json(newTodo);
  },
);
