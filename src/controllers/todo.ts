import { type NextFunction, type Request, type Response } from "express";
import { asyncWrapper } from "../utility/async-wrapper.js";
import { TodoManager } from "../db/todo.js";
import { generateUniqueId } from "../utility/generateUniqueId.js";

/**
 * Create a new Todo by handling a request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
export const createTodo = asyncWrapper(
  async (req: Request, res: Response, nex: NextFunction): Promise<void> => {
    const todoManager = TodoManager.getInstance();
    const newTodo = await todoManager.validateTodo(req.body);
    //if newTodo has default id(1) then generate uniqueID
    if(newTodo.id===1){
      newTodo.id= await generateUniqueId();
    }
    await todoManager.createTodo(newTodo);
    res.status(201).json(newTodo);
  },
);
