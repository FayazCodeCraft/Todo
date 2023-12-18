import { type TodoInterface as Todo } from "./todo.js";
import { type User } from "./user.js";

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
  getAllTodoIds: (userID: string) => Promise<number[]>;
  /**
   *  Create a new Todo.
   * @param newTodo - The new Todo object to create.
   * @returns A Promise that resolves when the Todo is created.
   */
  createTodo: (userID: string, newTodo: Todo) => Promise<Todo>;
  /**
   * Retrieve a subset of todos from the database.
   * @param startIndex - The start index for selecting todos.
   * @param endIndex  -  The end index for selecting todos.
   * @returns A promise that resolves with an array of selected todos.
   */
  getTodos: (
    userID: string,
    startIndex: number,
    endIndex: number,
  ) => Promise<Todo[]>;
  /**
   * Retrieve a todo item by its ID from the database.
   * @param todoId - The unique identifier of the todo item to retrieve.
   * @returns  A Promise that resolves with the todo item if found, or undefined if not found.
   */
  getTodo: (userID: string, todoId: number) => Promise<Todo>;
  /**
   * Update a todo item in the database with the specified ID.
   * @param {number} todoId - The ID of the todo item to update.
   * @param {Todo} todo - The updated todo item with new values.
   * @returns A promise that resolves with the updated todo item ,if the update is successfu  or null if the specified ID is not found.
   */
  updateTodo: (userID: string, todoId: number, todo: Todo) => Promise<Todo>;
  /**
   * Checks if a todo with the specified ID exists in the database.
   * @param todoId - The ID of the todo to check for existence.
   * @returns  A Promise that resolves to a boolean indicating whether the todo with the given ID exists.
   *
   */
  idExist: (userID: string, todoId: number) => Promise<boolean>;
  /**
   * Delete a todo item from the database.
   * @param todoId - The ID of the todo item to be deleted.
   * @returns  A Promise that resolves when the deletion is completed.
   */
  deleteTodo: (userID: string, todoId: number) => Promise<void>;
  /**
   * Finds a user by their user ID.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves with the user if found, or rejects if not found.
   */
  findUserById: (userId: string) => Promise<User>;
  /**
   * Validates a user against a predefined schema.
   * @param user - The user to be validated.
   * @returns A promise that resolves with the validated user if the validation is successful.
   */
  validateUser: (user: User) => Promise<User>;
  /**
   * Creates a new user and adds it to the database
   * @param user - The new user to be created.
   * @returns A promise that resolves with the created user if the creation is successful.
   */
  createUser: (
    user: User,
  ) => Promise<Omit<User, "userPassword" | "todos" | "refreshToken">>;
  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with the user if found, or undefined if not found.
   */
  getUser: (email: string) => Promise<User | undefined>;
  /**
   * Adds a refresh token to a user's record.
   * @param userID - The unique identifier of the user.
   * @param refreshToken - The refresh token to be added.
   * @returns A promise that resolves when the refresh token is successfully added.
   */
  addRefreshToken: (userID: string, refreshToken: string) => Promise<void>;
}
