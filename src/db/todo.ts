import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { type TodoInterface as Todo } from "../interfaces/todo.js";
import { type TodoDataBaseData as Todos } from "../interfaces/todo-db.js";
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
   * @returns A promise that resolves to true if the todo was created successfully or false if the ID already exists.
   */
  async createTodo(newTodo: Todo): Promise<Todo> {
    await this.db.read();
    this.db.data.todos.push({ ...newTodo });
    await this.db.write();
    return newTodo;
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

  /**
   * Retrieve a todo item by its ID from the database.
   * @param todoId - The unique identifier of the todo item to retrieve.
   * @returns  A Promise that resolves with the todo item if found, or undefined if not found.
   */
  async getTodo(todoId: number): Promise<Todo> {
    await this.db.read();
    const todo = this.db.data.todos.find((todo) => todo.id === todoId) as Todo;
    return todo;
  }

  /**
   * Checks if a todo with the specified ID exists in the database.
   * @param todoId - The ID of the todo to check for existence.
   * @returns  A Promise that resolves to a boolean indicating whether the todo with the given ID exists.
   *
   */
  async idExist(todoId: number): Promise<boolean> {
    await this.db.read();
    const todo = this.db.data.todos.find((todo) => todo.id === todoId);
    return !!todo;
  }

  /**
   * Update a todo item in the database with the specified ID.
   * @param {number} todoId - The ID of the todo item to update.
   * @param {Todo} todo - The updated todo item with new values.
   * @returns A promise that resolves with the updated todo item ,if the update is successfu  or null if the specified ID is not found.
   */
  async updateTodo(todoId: number, todo: Todo): Promise<Todo> {
    await this.db.read();
    const todoToUpdate = this.db.data.todos.find(
      (dbTodo) => dbTodo.id === todoId,
    ) as Todo;

    todoToUpdate.title = todo.title;
    todoToUpdate.description = todo.description;
    todoToUpdate.dueDate = todo.dueDate;
    todoToUpdate.completed = todo.completed;
    todoToUpdate.updatedAt = todo.updatedAt;
    await this.db.write();
    return todoToUpdate;
  }

  /**
   * Delete a todo item from the database.
   * @param todoId - The ID of the todo item to be deleted.
   * @returns  A Promise that resolves when the deletion is completed.
   */
  async deleteTodo(todoId: number): Promise<void> {
    await this.db.read();
    const indexTodelete = this.db.data.todos.findIndex(
      (todo) => todo.id === todoId,
    );
    this.db.data.todos.splice(indexTodelete, 1);
    await this.db.write();
  }
}
