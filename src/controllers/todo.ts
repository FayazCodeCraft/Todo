import { type NextFunction, type Request, type Response } from "express";
import { asyncWrapper } from "../utility/async-wrapper.js";
import { TodoManager } from "../db/todo.js";
import { generateUniqueId } from "../utility/generateUniqueId.js";
import { createCustomError } from "../errors/custom-error.js";

/**
 * Create a new Todo by handling a request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed,If Id already exist in database error is thrown.
 */
export const createTodo = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const todoManager = TodoManager.getInstance();
    const newTodo = await todoManager.validateTodo(req.body);
    // if newTodo has default id(1) then generate uniqueID
    if (newTodo.id === 1) {
      newTodo.id = await generateUniqueId();
    }
    const success = await todoManager.createTodo(newTodo);
    if (success) {
      res.status(201).json(newTodo);
    } else {
      res.status(400).json({ error: `ID: ${newTodo.id} already exists` });
    }
  },
);

/**
 * Retrieve a list of todos with pagination.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
export const getTodos = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestedPage = parseInt(req.query.page as string) || 1;
    const todosPerPage = parseInt(req.query.limit as string) || 10;
    const skipCount = (requestedPage - 1) * todosPerPage;
    const todoManager = TodoManager.getInstance();
    let todos = await todoManager.getTodos(skipCount, skipCount + todosPerPage);
    if (req.query.status === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }
    if (req.query.sort === "dueDate") {
      todos = todos.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      });
    }
    res.status(200).json(todos);
  },
);

/**
 * Get a todo item by its ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed,If the specified todo item with the given ID is not found, a custom error with a 404 status code is thrown.
 */
export const getTodo = asyncWrapper(
  async (req: Request, res: Response, nex: NextFunction): Promise<void> => {
    const id = parseInt(req.params.todoId);
    const todoManager = TodoManager.getInstance();
    const todo = await todoManager.getTodo(id);
    if (!todo) {
      throw createCustomError(`Id: ${id} Not Found`, 404);
    }
    res.status(200).json(todo);
  },
);
