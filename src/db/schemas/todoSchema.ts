import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./userSchema.js";
import { createInsertSchema } from "drizzle-zod";
import type zod from "zod";

/**
 * Represents the 'todos' table in the SQLite database.
 */
export const todos = sqliteTable("todos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: text("due_date").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  userId: text("user_id").references(() => users.userId),
});

export const todoSchema = createInsertSchema(todos, {
  title: (schema) =>
    schema.title
      .min(5, { message: "Title must be at least 5 characters long" })
      .max(50, { message: "Title must be at most 50 characters long" }),
  description: (schema) =>
    schema.description.max(1000, {
      message: "Description must be at most 1000 characters long",
    }),
  dueDate: (schema) =>
    schema.dueDate
      .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
        message: "Due_date should be in the format 'YYYY-MM-DD'",
      })
      .refine((date) => new Date(date) > new Date(), {
        message: "Due_date should be greater than today's date",
      }),
});

export type Todo = zod.infer<typeof todoSchema>;
