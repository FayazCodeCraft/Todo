import todoSchema from "../validators/todo.js";

describe("Test: todoSchema", () => {
  test("should validate a valid todo object", () => {
    const todo = {
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
    };

    const parsedTodo = todoSchema.parse(todo);
    const { id, title, description, dueDate } = parsedTodo;
    expect(id).toBe(1);
    expect({ title, description, dueDate }).toEqual(todo);
  });

  test("should reject a todo object with an invalid id", () => {
    const todo = {
      id: -1,
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "ID must be a positive integer",
    );
  });

  test("should reject a todo object with an empty title", () => {
    const todo = {
      id: 10,
      title: "",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
    };
    expect(() => todoSchema.parse(todo)).toThrowError(
      "Title must be at least 5 character long",
    );
  });

  test("should reject a todo object with a title that is longer than 50 characters", () => {
    const todo = {
      id: 1,
      title: "Exploring New Horizons: A World of Wonders, is a concise and intriguing statement. It suggests embarking on an exciting journey or adventure to discover new and fascinating aspects of the world. This phrase conveys a sense of curiosity and the idea that the world is full of amazing and unknown things waiting to be explored. It's a call to action or an invitation to step into the unknown and experience the wonders that the world has to offer",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "Title must be at most 50 characters long",
    );
  });

  test("should reject a todo object with a due date in an invalid format", () => {
    const todo = {
      id: 1,
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21-invalid",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "Due_date should be in the format 'YYYY-MM-DD'",
    );
  });

  test("should reject a todo object with a due date that is in the past", () => {
    const todo = {
      id: 1,
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-20",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "Due_date should be greater than today's date",
    );
  });

  test("should create a todo object with a default created_At and updated_At", () => {
    const todo = {
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
    };

    const parsedTodo = todoSchema.parse(todo);

    expect(parsedTodo.created_At).toBeInstanceOf(Date);
    expect(parsedTodo.updated_At).toBeInstanceOf(Date);
  });

  test("should reject a todo object with a created_At property that is not a Date object", () => {
    const todo = {
      id: 1,
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
      created_At: "invalid_date",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "Expected date, received string",
    );
  });

  test("should reject a todo object with an updated_At property that is not a Date object", () => {
    const todo = {
      id: 1,
      title: "Write a blog post",
      description: "Write a blog post about Zod",
      dueDate: "2023-10-21",
      created_At: new Date("2023-10-20"),
      updated_At: "invalid_date",
    };

    expect(() => todoSchema.parse(todo)).toThrowError(
      "Expected date, received string",
    );
  });
});
