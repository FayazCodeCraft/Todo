import {type TodoInterface as Todo } from "./todo.js";

/**
 * This interface defines the contract for a Todo Manager.
 */
export interface TodoMangerInterface {
  /**
   * Validate a Todo object.
   * @param todo - The Todo object to validate.
   * @returns - A Promise that resolves to the validated Todo object.
   */
  validateTodo: (todo: Todo) => Promise<Todo>;
  /**
   * Get an array of all Todo IDs.
   * @returns A Promise that resolves to an array of todo IDs.
   */
  getAllTodoIds: () => Promise<number[]>;
  /**
   *  Create a new Todo.
   * @param newTodo - The new Todo object to create.
   * @returns A Promise that resolves when the Todo is created.
   */
  createTodo: (newTodo: Todo) => Promise<void>;
}
