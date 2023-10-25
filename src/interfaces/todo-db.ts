import { type TodoInterface } from "./todo.js";
/**
 * Represents the structure of the database data for Todos.
 */
export interface TodoDataBaseData {
  /**
   * An array of Todo items.
   */
  todos: TodoInterface[];
}
