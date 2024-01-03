import { db } from "../db/connection.js";
import { eq, and } from "drizzle-orm";
import { type Todo, todoSchema, todos } from "../db/schemas/todoSchema.js";

/**
 * Represents a todo manager for handlingng user Todos.
 */
export class TodoManager {
  private static instance: TodoManager;

  /**
   * Gets the singleton instance of the TodoManager.
   * @returns The singleton instance of TodoManager
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
   * Creates a new todo item and adds it to the database.
   * @param {Todo} newTodo - The new todo item to be created.
   * @returns todo created in database.
   */
  async createTodo(userID: string, newTodo: Todo): Promise<Todo> {
    newTodo.userId = userID;
    const createdTodo = await db.insert(todos).values(newTodo).returning();
    return createdTodo[0];
  }

  /**
   * Retrieve a subset of todos from the database.
   * @param startIndex - The start index for selecting todos.
   * @param endIndex  -  The end index for selecting todos.
   * @returns an array of selected todos.
   */
  async getTodos(
    userID: string,
    startIndex: number,
    endIndex: number,
  ): Promise<Todo[]> {
    const allTodos = await db
      .select({
        id: todos.id,
        title: todos.title,
        description: todos.description,
        dueDate: todos.dueDate,
        completed: todos.completed,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
      })
      .from(todos)
      .where(eq(todos.userId, userID));

    const selectedTodos = allTodos.slice(startIndex, endIndex);

    return selectedTodos;
  }

  /**
   * Retrieve a todo item by its ID from the database.
   * @param todoId - The unique identifier of the todo item to retrieve.
   * @returns  A Promise that resolves with the todo item if found, or undefined if not found.
   */
  async getTodo(userID: string, todoId: number): Promise<Todo | undefined> {
    const retrievedTodos = await db
      .select({
        id: todos.id,
        title: todos.title,
        description: todos.description,
        dueDate: todos.dueDate,
        completed: todos.completed,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
      })
      .from(todos)
      .where(and(eq(todos.userId, userID), eq(todos.id, todoId)));

    return retrievedTodos.length > 0 ? retrievedTodos[0] : undefined;
  }

  /**
   * Delete a todo item from the database.
   * @param todoId - The ID of the todo item to be deleted.
   * @returns  A Promise that resolves when the deletion is completed.
   */
  async deleteTodo(userID: string, todoId: number): Promise<void> {
    await db
      .delete(todos)
      .where(and(eq(todos.userId, userID), eq(todos.id, todoId)));
  }

  /**
   * Update a todo item in the database with the specified ID.
   * @param {number} todoId - The ID of the todo item to update.
   * @param {Todo} todo - The updated todo item with new values.
   * @returns A promise that resolves with the updated todo item.
   */
  async updateTodo(userID: string, todoId: number, todo: Todo): Promise<Todo> {
    todo.updatedAt = new Date().toISOString();
    await db
      .update(todos)
      .set(todo)
      .where(and(eq(todos.userId, userID), eq(todos.id, todoId)));
    return todo;
  }
}
