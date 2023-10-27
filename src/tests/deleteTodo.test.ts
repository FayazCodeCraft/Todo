import type express from "express";
import request from "supertest";
import app from "../app.js";
import { apiKeyMiddleware } from "../middlewares/authorization.js";

describe("DELETE /api/v1/todo/:todoId", () => {
  let server: express.Express;
  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should delete a todo successfully for valid id", async () => {
    const todoId = 1;
    const response = await request(server)
      .delete(`/api/v1/todos/${todoId}`)
      .set("Authorization", "Bearer abc123xyz456");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: `Todo with ${todoId} deleted successfully`,
    });
  });

  test("should handle invalid id", async () => {
    const nonExistentTodoId = 100;
    const response = await request(server)
      .delete(`/api/v1/todos/${nonExistentTodoId}`)
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `Id: ${nonExistentTodoId} Not Found`,
    });
  });
});
