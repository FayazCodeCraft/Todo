import { type TodoInterface as Todo } from "./todo.js";

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
  createTodo: (newTodo: Todo) => Promise<Todo>;
  /**
   * Retrieve a subset of todos from the database.
   * @param startIndex - The start index for selecting todos.
   * @param endIndex  -  The end index for selecting todos.
   * @returns A promise that resolves with an array of selected todos.
   */
  getTodos: (startIndex: number, endIndex: number) => Promise<Todo[]>;
  /**
   * Retrieve a todo item by its ID from the database.
   * @param todoId - The unique identifier of the todo item to retrieve.
   * @returns  A Promise that resolves with the todo item if found, or undefined if not found.
   */
  getTodo: (todoId: number) => Promise<Todo>;
  /**
   * Update a todo item in the database with the specified ID.
   * @param {number} todoId - The ID of the todo item to update.
   * @param {Todo} todo - The updated todo item with new values.
   * @returns A promise that resolves with the updated todo item ,if the update is successfu  or null if the specified ID is not found.
   */
  updateTodo: (todoId: number, todo: Todo) => Promise<Todo>;
  /**
   * Checks if a todo with the specified ID exists in the database.
   * @param todoId - The ID of the todo to check for existence.
   * @returns  A Promise that resolves to a boolean indicating whether the todo with the given ID exists.
   *
   */
  idExist: (todoId: number) => Promise<boolean>;
  /**
   * Delete a todo item from the database.
   * @param todoId - The ID of the todo item to be deleted.
   * @returns  A Promise that resolves when the deletion is completed.
   */
  deleteTodo: (todoId: number) => Promise<void>;
}
