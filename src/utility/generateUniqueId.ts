import { TodoManager } from "../db/todo.js";

/**
 * Generates a unique ID for a todo item associated with the given user ID.
 * @param userID - The user ID for whom the unique ID is generated.
 * @returns A Promise that resolves to a unique ID for the user's todo item.
 */
export const generateUniqueId = async (userID: string): Promise<number> => {
  // Initialize a starting ID
  let id = 1;
  const todoManger = TodoManager.getInstance();
  const todoIds = await todoManger.getAllTodoIds(userID);
  while (todoIds.includes(id)) {
    id++;
  }
  return id;
};
