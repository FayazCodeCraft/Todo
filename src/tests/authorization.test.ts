import type express from "express";
import request from "supertest";
import app from "../app";
import { apiKeyMiddleware } from "../middlewares/authorization.js";

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
    expect(response.body).toEqual({ message: "Welcome to Todo Api" });
  });

  test("should give appropriate message when an invalid API key is provided", async () => {
    const response = await request(server)
      .get("/")
      .set("Authorization", "Bearer abc123xyz4567");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });
});
