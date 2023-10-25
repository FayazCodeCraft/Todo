import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { type TodoInterface as Todo } from "../interfaces/todo.js";
import { type TodoDataBaseData as Todos } from "../interfaces/todo-db.js";
import { createCustomError } from "../errors/custom-error.js";
import todoSchema from "../validators/todo.js";
import { type TodoMangerInterface } from "../interfaces/todo-manager.js";

/**
 * Class representing a TodoManager for managing todo items.
 */
export class TodoManager implements TodoMangerInterface {
  private static instance: TodoManager;
  private readonly db: Low<Todos>;

  /**
   * Private constructor to create a new instance of TodoManager.
   */
  private constructor() {
    const adapter = new JSONFile<Todos>("src/db/todos.json");
    this.db = new Low(adapter, { todos: [] });
  }

  /**
   * Get a singleton instance of TodoManager.
   * @returns {TodoManager} - The singleton instance of TodoManager.
   */
  static getInstance(): TodoManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new TodoManager();
    return this.instance;
  }

  /**
   * Validates a todo item against the defined schema.
   * @param {Todo} todo - The todo item to be validated.
   * @returns Promise that resolves to Todo object.
   */
  async validateTodo(todo: Todo): Promise<Todo> {
    const validatedTodo = todoSchema.parse(todo);
    return validatedTodo;
  }

  /**
   * Retrieves all the IDs of existing todo items.
   * @returns  A Promise that resolves to an array of Todo IDs.
   */
  async getAllTodoIds(): Promise<number[]> {
    await this.db.read();
    const todoIds = this.db.data.todos.map((todo) => todo.id);
    return todoIds;
  }

  /**
   * Creates a new todo item and adds it to the database.
   * @param {Todo} newTodo - The new todo item to be created.
   * @returns A Promise that resolves when the operation is completed, throws CustomError if a Todo with the same ID already exists in the database
   */
  async createTodo(newTodo: Todo): Promise<void> {
    await this.db.read();
    const idExist = this.db.data.todos.find(
      (dbTodo) => dbTodo.id === newTodo.id,
    );
    if (idExist === undefined) {
      this.db.data.todos.push({ ...newTodo });
      await this.db.write();
    } else {
      throw createCustomError(`Id: ${newTodo.id} already exists`, 400);
    }
  }

  /**
   * Retrieve a subset of todos from the database.
   * @param startIndex - The start index for selecting todos.
   * @param endIndex  -  The end index for selecting todos.
   * @returns A promise that resolves with an array of selected todos.
   */
  async getTodos(startIndex: number, endIndex: number): Promise<Todo[]> {
    await this.db.read();
    const allTodos = this.db.data.todos;
    const selectedTodos = allTodos.slice(startIndex, endIndex);
    return selectedTodos;
  }
}
