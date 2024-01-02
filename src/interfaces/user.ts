import { type TodoDataBaseData } from "./todo-db.js";

/**
 * Represents the structure of a user in the system.
 */
export interface User {
  /**
   * Unique identifier for the user.
   */
  userId: string;
  /**
   * The name of the user.
   */
  userName: string;
  /**
   * The email address of the user.
   */
  userEmail: string;
  /**
   * The hashed password of the user.
   */
  userPassword: string;
  /**
   * The list of todos associated with the user.
   */
  todos: TodoDataBaseData["todos"];
  /**
   * The refresh token associated with the user for token refresh.
   */
  refreshToken: string;
}
