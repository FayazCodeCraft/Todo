import type express from "express";
import request from "supertest";
import app from "../app";
import { apiKeyMiddleware } from "../middleware/authorization.js";

describe(" Test: apiKeyMiddleware", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should get response when an valid API key is provided", async () => {
    const response = await request(server)
      .get("/")
      .set("Authorization", "Bearer abc123xyz456");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to My Todo Api" });
  });

  test("should throw a custom error when an invalid API key is provided", async () => {
    const response = await request(server)
      .get("/")
      .set("Authorization", "Bearer abc123xyz4567");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });
});
