import { eq } from "drizzle-orm";
import { type User, userSchema, users } from "../db/schemas/userSchema.js";
import { hashPassword } from "../utility/hashPassword.js";
import { db } from "../db/connection.js";

/**
 * Represents a user authentication manager for handling authentication-related operations.
 */
export class UserAuthenticationManager {
  private static instance: UserAuthenticationManager;

  /**
   * Gets the singleton instance of the UserAuthenticationManager.
   * @returns The singleton instance of UserAuthenticationManager
   */
  static getInstance(): UserAuthenticationManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserAuthenticationManager();
    return this.instance;
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
    user.userPassword = await hashPassword(user.userPassword);
    await db.insert(users).values(user);
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
    const user = await db
      .select()
      .from(users)
      .where(eq(users.userEmail, email));
    return user.length > 0 ? user[0] : undefined;
  }

  /**
   * Finds a user by their user ID.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves with the user.
   */
  async findUserById(userId: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.userId, userId));
    return user.length > 0 ? user[0] : undefined;
  }

  /**
   * Adds a refresh token to a user's record.
   * @param userID - The unique identifier of the user.
   * @param refreshToken - The refresh token to be added.
   * @returns A promise that resolves when the refresh token is successfully added.
   */
  async addRefreshToken(userID: string, refreshToken: string): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken })
      .where(eq(users.userId, userID));
  }
}
