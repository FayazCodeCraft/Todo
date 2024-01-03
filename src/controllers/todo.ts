import { type NextFunction, type Response } from "express";
import { asyncWrapper } from "../utility/async-wrapper.js";
import { type AuthenticatedRequest } from "../middlewares/authentication.js";
import { TodoManager } from "../model/todoModel.js";
import { createCustomError } from "../errors/custom-error.js";
/**
 * Create a new Todo by handling a request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed,If Id already exist in database error is thrown.
 */
export const createTodo = asyncWrapper(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user!.userID;
    const todoManager = TodoManager.getInstance();
    const newTodo = await todoManager.validateTodo(req.body);
    const todo = await todoManager.createTodo(userId, newTodo);
    res.status(201).json(todo);
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
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user!.userID;
    const requestedPage = parseInt(req.query.page as string) || 1;
    const todosPerPage = parseInt(req.query.limit as string) || 10;
    const skipCount = (requestedPage - 1) * todosPerPage;
    const todoManager = TodoManager.getInstance();
    let todos = await todoManager.getTodos(
      userId,
      skipCount,
      skipCount + todosPerPage,
    );
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
  async (
    req: AuthenticatedRequest,
    res: Response,
    nex: NextFunction,
  ): Promise<void> => {
    const userId = req.user!.userID;
    const id = parseInt(req.params.todoId);
    const todoManager = TodoManager.getInstance();
    const todo = await todoManager.getTodo(userId, id);
    if (!todo) {
      throw createCustomError(`Id: ${id} Not Found`, 404);
    } else {
      res.status(200).json(todo);
    }
  },
);

/**
 * Update a todo item for the specified ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>}  A promise that resolves when the update is complete. If the specified ID is not found, a 404 error is thrown.
 */

export const updateTodo = asyncWrapper(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user!.userID;
    const id = parseInt(req.params.todoId);
    const todoManager = TodoManager.getInstance();
    const todo = await todoManager.validateTodo(req.body);
    const todoExist = await todoManager.getTodo(userId, id);
    if (!todoExist) {
      throw createCustomError(`Id: ${id} Not Found`, 404);
    } else {
      const updatedTodo = await todoManager.updateTodo(userId, id, todo);
      res.status(200).json(updatedTodo);
    }
  },
);

/**
 * Delete a todo item for the specified ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>}  A promise that resolves when the delete is complete. If the specified ID is not found, a 404 error is thrown.
 */
export const deleteTodo = asyncWrapper(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user!.userID;
    const id = parseInt(req.params.todoId);
    const todoManager = TodoManager.getInstance();
    const todoExist = await todoManager.getTodo(userId, id);
    if (!todoExist) {
      throw createCustomError(`Id: ${id} Not Found`, 404);
    } else {
      await todoManager.deleteTodo(userId, id);
      res.status(200).json({ message: `Todo with ${id} deleted successfully` });
    }
  },
);
