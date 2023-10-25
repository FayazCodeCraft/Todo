import type express from "express";
import request from "supertest";
import app from "../app.js";
import { apiKeyMiddleware } from "../middlewares/authorization.js";
import { type TodoInterface as Todo } from "../interfaces/todo.js";

describe("GET /api/v1/todos", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  it("should return the first page of todos by default", async () => {
    const response = await request(server)
      .get("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(10); // Default page size is 10 todos per page.
  });

  it("should allow specifying the page size using the 'limit' query parameter", async () => {
    const response = await request(server)
      .get("/api/v1/todos?limit=5")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
  });

  it("should allow specifying the page number using the 'page' query parameter", async () => {
    const response = await request(server)
      .get("/api/v1/todos?page=2")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
  });

  test("should filter the todos based on the 'status' query parameter", async () => {
    const response = await request(server)
      .get("/api/v1/todos?status=completed")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
    response.body.forEach((todo: Todo): void => {
      expect(todo.completed).toBe(true);
    });
  });

  test("should sort the todos based on the 'dueDate' query parameter", async () => {
    const response = await request(server)
      .get("/api/v1/todos?sort=dueDate")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(10);
  });

  it("should return a list of all todos, filtered by status and paginated", async () => {
    const response = await request(server)
      .get("/api/v1/todos?status=completed&limit=5&page=2")
      .set("Authorization", "Bearer abc123xyz456");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);

    response.body.forEach((todo: Todo) => {
      expect(todo.completed).toBe(true);
    });
  });
});
