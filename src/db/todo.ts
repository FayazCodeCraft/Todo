import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { type TodoInterface as Todo } from "../interfaces/todo.js";
import { type TodoDataBaseData as Todos } from "../interfaces/todo-db.js";
import { createCustomError } from "../errors/custom-error.js";

// Create a new instance of Low with a JSONFile adapter
const adapter = new JSONFile<Todos>("src/db/todos.json");
const db = new Low(adapter, { todos: [] });

/**
 * Creates a new Todo in the database.
 * @param newTodo -The new Todo to be created.
 * @returns A Promise that resolves when the operation is completed, throws CustomError if a Todo with the same ID already exists in the database.
 */
export const createTodoInDB = async (newTodo: Todo): Promise<void> => {
  await db.read();
  const idExist = db.data.todos.find((dbTodo) => dbTodo.id === newTodo.id);
  if (idExist === undefined) {
    db.data.todos.push({ ...newTodo });
    await db.write();
  } else {
    throw createCustomError(`Id : ${newTodo.id} alreday exist `, 400);
  }
};
