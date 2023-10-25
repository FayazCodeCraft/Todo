import type express from "express";
import request from "supertest";
import app from "../app.js"; // Make sure the path to your app is correct.
import { apiKeyMiddleware } from "../middlewares/authorization.js";

describe("POST /api/v1/todos", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should return a 400 error if id is a negative number", async () => {
    const invalidTodoData = {
      id: -1, // Negative id is not allowed.
      title: "Valid title",
      description: "Valid description",
      dueDate: "2023-11-30",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed => id: ID must be a positive integer",
    });
  });

  test("should return a 400 error if title is not provided", async () => {
    const invalidTodoData = {
      description: "This title is too short.",
      dueDate: "2023-11-31",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed => title: Required",
    });
  });

  test("should return a 400 error if title is short", async () => {
    const invalidTodoData = {
      title: "test",
      description: "This title is too short.",
      dueDate: "2023-11-31",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Validation failed => title: Title must be at least 5 characters long",
    });
  });

  test("should return a 400 error if title provided is too long", async () => {
    const invalidTodoData = {
      title:
        "Exploring New Horizons: A World of Wonders, is a concise and intriguing statement. It suggests embarking on an exciting journey or adventure to discover new and fascinating aspects of the world. This phrase conveys a sense of curiosity and the idea that the world is full of amazing and unknown things waiting to be explored. It's a call to action or an invitation to step into the unknown and experience the wonders that the world has to offer",
      description: "This title is too long.",
      dueDate: "2023-11-31",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Validation failed => title: Title must be at most 50 characters long",
    });
  });

  test("should return a 400 error if description is missing", async () => {
    const invalidTodoData = {
      title: "Valid title",
      dueDate: "2023-11-30",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed => description: Required",
    });
  });

  test("should return a 400 error if dueDate is not in the correct format", async () => {
    const invalidTodoData = {
      title: "Valid title",
      description: "Valid description",
      dueDate: "2023/11/31", // Due date format is incorrect.
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Validation failed => dueDate: Due_date should be in the format 'YYYY-MM-DD'",
    });
  });

  test("should return a 400 error if dueDate is missing", async () => {
    const invalidTodoData = {
      title: "Valid title",
      description: "Valid description",
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed => dueDate: Required",
    });
  });

  test("should return a 400 error if dueDate is in the past", async () => {
    const invalidTodoData = {
      title: "Valid title",
      description: "Valid description",
      dueDate: "2022-11-30", // Due date is in the past.
    };

    const response = await request(server)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abc123xyz456")
      .send(invalidTodoData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Validation failed => dueDate: Due_date should be greater than today's date",
    });
  });
});
