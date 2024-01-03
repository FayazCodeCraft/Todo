import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";
import type zod from "zod";

/**
 * Represents the 'users' table in the SQLite database.
 */
export const users = sqliteTable("users", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull().unique(),
  userPassword: text("user_password").notNull(),
  refreshToken: text("refresh_token").notNull().default(""),
});

export const userSchema = createInsertSchema(users, {
  userId: (schema) => schema.userId.default(() => createId()),
  userName: (schema) =>
    schema.userName.max(10, {
      message: "UserName must contain at most 10 character(s)",
    }),
  userEmail: (schema) => schema.userEmail.email(),
  userPassword: (schema) =>
    schema.userPassword.min(8, {
      message: "Password must contain at least 8 character(s)",
    }),
});

export type User = zod.infer<typeof userSchema>;
