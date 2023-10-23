import zod from "zod";
import { generateUniqueId } from "../utility/generateUniqueId.js";
// console.log(todosData)

const todoSchema = (() => {
  return zod.object({
    // 'id' field: Ensure it's a positive integer and use a default value if not provided.
    id: zod
      .number()
      .int()
      .refine((value) => value >= 1, {
        message: "ID must be a positive integer",
      })
      .default(() => generateUniqueId()),

    // 'title' field: Validate the length of the title.
    title: zod
      .string()
      .min(5, { message: "Title must be at least 5 characters long" })
      .max(50, { message: "Title must be at most 50 characters long" }),

    // 'description' field: Limit the maximum length of the description.
    description: zod.string().max(1000, {
      message: "Description must be at most 1000 characters long",
    }),

    // 'dueDate' field: Validate date format and ensure it's in the future.
    dueDate: zod
      .string()
      .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
        message: "Due_date should be in the format 'YYYY-MM-DD'",
      })
      .refine((date) => new Date(date) > new Date(), {
        message: "Due_date should be greater than today's date",
      }),

    // 'created_At' and 'updated_At' fields: Set default date values.
    created_At: zod.date().default(() => new Date()),
    updated_At: zod.date().default(() => new Date()),

    completed:zod.boolean().default(()=>false)
  });
})();

export default todoSchema;
