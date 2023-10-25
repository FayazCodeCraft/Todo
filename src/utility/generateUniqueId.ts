import { TodoManager } from "../db/todo.js";

export const generateUniqueId = async (): Promise<number> => {
  // Initialize a starting ID
  let id = 1;
  const todoManger = TodoManager.getInstance();
  const todoIds = await todoManger.getAllTodoIds();
  while (todoIds.includes(id)) {
    id++;
  }
  return id;
};
