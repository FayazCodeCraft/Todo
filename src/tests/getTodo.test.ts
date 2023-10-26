import type express from "express";
import request from "supertest";
import app from "../app.js";
import { apiKeyMiddleware } from "../middlewares/authorization.js";

describe("GET /api/v1/todo/:todoId", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should return todo based on given todoId(1)", async () => {
    const response = await request(server)
      .get("/api/v1/todos/1")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      id: 1,
      title: "Pay Bills",
      description: "Settle the utility and credit card bills",
      dueDate: "2023-12-10",
      created_At: "2023-10-23T03:38:03.620Z",
      updated_At: "2023-10-23T03:38:03.620Z",
      completed: false,
    });
  });

  test("should return todo based on given todoId(2)", async () => {
    const response = await request(server)
      .get("/api/v1/todos/2")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      id: 2,
      title: "Prepare for Meeting",
      description: "Gather presentation materials for the team meeting",
      dueDate: "2023-12-25",
      created_At: "2023-10-23T03:38:27.043Z",
      updated_At: "2023-10-23T03:38:27.043Z",
      completed: false,
    });
  });

  test("should return todo based on given todoId(15)", async () => {
    const response = await request(server)
      .get("/api/v1/todos/15")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      id: 15,
      title: "Cook Dinner",
      description: "Prepare a delicious dinner",
      dueDate: "2023-11-09",
      created_At: "2023-10-25T23:55:00.987Z",
      updated_At: "2023-10-25T23:55:00.987Z",
      completed: true,
    });
  });

  test("should throw error message for invalid Id", async () => {
    const response = await request(server)
      .get("/api/v1/todos/100")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Id: 100 Not Found",
    });
  });
});
