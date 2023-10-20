import type express from "express";
import request from "supertest";
import app from "../app";
import { apiKeyMiddleware } from "../middlewares/authorization.js";

describe("Test : for invalid routes", () => {
  let server: express.Express;

  beforeEach(() => {
    server = app;
    server.use(apiKeyMiddleware);
  });

  test("should give appropriate message for invalid routes", async () => {
    const response = await request(server)
      .get("/unknownRoute")
      .set("Authorization", "Bearer abc123xyz456");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Route does not exist" });
  });
});
