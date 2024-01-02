import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { type TodoInterface as Todo } from "../interfaces/todo.js";
import todoSchema from "../validators/todo.js";
import { type TodoMangerInterface } from "../interfaces/todo-manager.js";
import config from "config";
import dotenv from "dotenv";
import { type User } from "../interfaces/user.js";
import { userSchema } from "../validators/user.js";
import { type Users } from "../interfaces/users.js";
import { hashPassword } from "../utility/hashPassword.js";
dotenv.config();

/**
 * Determine the database name based on the current environment using configuration settings.
 * This allows the code to dynamically select the database based on the environment.
 */
const dbName: string = config.get(`${process.env.NODE_ENV}.dbName`);

/**
 * Class representing a TodoManager for managing todo items.
 */
export class TodoManager implements TodoMangerInterface {
  private static instance: TodoManager;
  private readonly db: Low<Users>;

  /**
   * Private constructor for initializing a database instance.
   */
  private constructor() {
    // Check the environment,if it is production initialize production database.
    if (process.env.NODE_ENV === "production") {
      const adapter = new JSONFile<Users>(dbName);
      this.db = new Low(adapter, { users: [] });
    }
    // Else ,initialize development database.
    else {
      const adapter = new JSONFile<Users>(dbName);
      this.db = new Low(adapter, { users: [] });
    }
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
   * Finds a user by their user ID.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves with the user.
   */
  async findUserById(userId: string): Promise<User> {
    await this.db.read();
    return this.db.data.users.find((user) => user.userId === userId)!;
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
  async getAllTodoIds(userID: string): Promise<number[]> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const todoIds = user.todos.map((todo) => todo.id);
    return todoIds;
  }

  /**
   * Creates a new todo item and adds it to the database.
   * @param {Todo} newTodo - The new todo item to be created.
   * @returns A promise that resolves to true if the todo was created successfully or false if the ID already exists.
   */
  async createTodo(userID: string, newTodo: Todo): Promise<Todo> {
    await this.db.read();
    const user = await this.findUserById(userID);
    user.todos.push(newTodo);
    await this.db.write();
    return newTodo;
  }

  /**
   * Retrieve a subset of todos from the database.
   * @param startIndex - The start index for selecting todos.
   * @param endIndex  -  The end index for selecting todos.
   * @returns A promise that resolves with an array of selected todos.
   */
  async getTodos(
    userID: string,
    startIndex: number,
    endIndex: number,
  ): Promise<Todo[]> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const allTodos = user.todos;
    const selectedTodos = allTodos.slice(startIndex, endIndex);
    return selectedTodos;
  }

  /**
   * Retrieve a todo item by its ID from the database.
   * @param todoId - The unique identifier of the todo item to retrieve.
   * @returns  A Promise that resolves with the todo item if found, or undefined if not found.
   */
  async getTodo(userID: string, todoId: number): Promise<Todo> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const todo = user.todos.find((todo) => todo.id === todoId) as Todo;
    return todo;
  }

  /**
   * Checks if a todo with the specified ID exists in the database.
   * @param todoId - The ID of the todo to check for existence.
   * @returns  A Promise that resolves to a boolean indicating whether the todo with the given ID exists.
   *
   */
  async idExist(userID: string, todoId: number): Promise<boolean> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const todo = user.todos.find((todo) => todo.id === todoId);
    return !!todo;
  }

  /**
   * Update a todo item in the database with the specified ID.
   * @param {number} todoId - The ID of the todo item to update.
   * @param {Todo} todo - The updated todo item with new values.
   * @returns A promise that resolves with the updated todo item ,if the update is successfu  or null if the specified ID is not found.
   */
  async updateTodo(userID: string, todoId: number, todo: Todo): Promise<Todo> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const todoToUpdate = user.todos.find(
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
  async deleteTodo(userID: string, todoId: number): Promise<void> {
    await this.db.read();
    const user = await this.findUserById(userID);
    const indexTodelete = user.todos.findIndex((todo) => todo.id === todoId);
    user.todos.splice(indexTodelete, 1);
    await this.db.write();
  }

  /**
   * Validates a user against a predefined schema.
   * @param user - The user to be validated.
   * @returns A promise that resolves with the validated user if the validation is successful.
   */
  async validateUser(user: User): Promise<User> {
    const validatedUser = userSchema.parse(user);
    return validatedUser;
  }

  /**
   * Creates a new user and adds it to the database
   * @param user - The new user to be created.
   * @returns A promise that resolves with the created user if the creation is successful.
   */
  async createUser(
    user: User,
  ): Promise<Omit<User, "userPassword" | "todos" | "refreshToken">> {
    await this.db.read();
    user.userPassword = await hashPassword(user.userPassword);
    this.db.data.users.push(user);
    await this.db.write();
    const createdUser = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
    };
    return createdUser;
  }

  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves with the user if found, or undefined if not found.
   */
  async getUser(email: string): Promise<User | undefined> {
    await this.db.read();
    const user = this.db.data.users.find((user) => user.userEmail === email);
    await this.db.write();
    return user;
  }

  /**
   * Adds a refresh token to a user's record.
   * @param userID - The unique identifier of the user.
   * @param refreshToken - The refresh token to be added.
   * @returns A promise that resolves when the refresh token is successfully added.
   */
  async addRefreshToken(userID: string, refreshToken: string): Promise<void> {
    await this.db.read();
    const user = await this.findUserById(userID);
    user.refreshToken = refreshToken;
    await this.db.write();
  }

  /**
   * Retrieves the initial state of the database.
   * @returns the nitial state of the database.
   */
  async getinitialDBstate(): Promise<Users> {
    try {
      await this.db.read();
      const initialState = this.db.data;
      return initialState;
    } catch (error) {
      throw new Error("Failed to retrieve the initial database state.");
    }
  }

  /**
   * Resets the database to the provided initial state.
   * @param initialState - The initial state to reset the database to.
   */
  async resetDBToInitialState(initialState: Users): Promise<void> {
    try {
      await this.db.read();
      this.db.data = initialState;
      await this.db.write();
    } catch (error) {
      throw new Error("Failed to reset the database to the initial state.");
    }
  }
}
