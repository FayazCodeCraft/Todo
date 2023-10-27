import type express from "express";
import request from "supertest";
import app from "../app.js";
import { apiKeyMiddleware } from "../middlewares/authorization.js";

describe("PUT /api/v1/todos/:todoId", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should update a todo successfully", async () => {
    const validTodoData = {
      title: "Complete Assignment",
      description: "Finish the report by 5 PM",
      dueDate: "2023-10-31",
    };

    const response = await request(server)
      .put(`/api/v1/todos/1`)
      .set("Authorization", "Bearer abc123xyz456")
      .send(validTodoData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(validTodoData));
  });

  test("should handle throw error message for invalid Id request", async () => {
    const nonExistentTodoId = 100;
    const validTodoData = {
      title: "Complete Assignment",
      description: "Finish the report by 5 PM",
      dueDate: "2023-10-31",
    };
    const response = await request(server)
      .put(`/api/v1/todos/${nonExistentTodoId}`)
      .set("Authorization", "Bearer abc123xyz456")
      .send(validTodoData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `Id: ${nonExistentTodoId} Not Found`,
    });
  });

  test("should handle invalid todo data", async () => {
    const todoId = 1;
    const invalidTodoData = {
      // invalid title
      title: "",
      description: "Finish the report by 5 PM",
      // invalid dueDate
      dueDate: "2023-10",
    };

    const response = await request(app)
      .put(`/api/v1/todos/${todoId}`)
      .set("Authorization", "Bearer abc123xyz456")

      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Validation failed => title: Title must be at least 5 characters long, dueDate: Due_date should be in the format 'YYYY-MM-DD', dueDate: Due_date should be greater than today's date",
    });
  });
});
