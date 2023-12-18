import type express from "express";
import request from "supertest";
import app from "../app.js";
import { TodoManager } from "../db/todo.js";
import { type Users } from "../interfaces/users.js";

describe("Authentication Endpoints", () => {
  let server: express.Express;
  let initiaDBState: Users;
  beforeEach(async () => {
    try {
      const todoManager = TodoManager.getInstance();
      initiaDBState = await todoManager.getinitialDBstate();
      server = app;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

  afterEach(async () => {
    try {
      const todoManager = TodoManager.getInstance();
      await todoManager.resetDBToInitialState(initiaDBState);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

  test("Register user", async () => {
    const user = {
      userName: "abcd",
      userEmail: "abc3@gmail.com",
      userPassword: "12345678",
    };
    const response = await request(server)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body).includes({
      userName: user.userName,
      userEmail: user.userEmail,
    });
  });

  test("Registration should fail,if user alreday registered", async () => {
    const registeredUser = {
      userName: "abcde",
      userEmail: "abc@gmail.com",
      userPassword: "12345678",
    };
    const response = await request(server)
      .post("/api/v1/auth/register")
      .send(registeredUser);
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "User Already Exist" });
  });

  test("Login with invalid credentials", async () => {
    const user = {
      email: "abc@gmail.com",
      password: "1234567",
    };
    const response = await request(server)
      .post("/api/v1/auth/login")
      .send(user);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Credentials" });
  });

  test("Login with valid credentials", async () => {
    const user = {
      email: "abc@gmail.com",
      password: "12345678",
    };
    const response = await request(server)
      .post("/api/v1/auth/login")
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("loggedInUser");

    const { loggedInUser, accessToken, refreshToken } = response.body;
    expect(loggedInUser).toHaveProperty("userId");
    expect(loggedInUser).toHaveProperty("userName", "abcde");
    expect(loggedInUser).toHaveProperty("userEmail", "abc@gmail.com");
    expect(loggedInUser).toHaveProperty("todos");

    const refreshTokenCookie = response
      .get("Set-Cookie")
      .find((cookie) => cookie.startsWith("refreshToken="));
    const accessTokenCookie = response
      .get("Set-Cookie")
      .find((cookie) => cookie.startsWith("accessToken="));

    if (refreshTokenCookie) {
      const refreshTokenValue =
        refreshTokenCookie.match(/refreshToken=([^;]+)/)?.[1];
      expect(refreshTokenValue).toBe(refreshToken);
    } else {
      // Handle the case where refreshTokenCookie is undefined
      throw new Error("Refresh token cookie is not set");
    }

    if (accessTokenCookie) {
      const accessTokenValue =
        accessTokenCookie.match(/accessToken=([^;]+)/)?.[1];
      expect(accessTokenValue).toBe(accessToken);
    } else {
      // Handle the case where accessTokenCookie is undefined
      throw new Error("Access token cookie is not set");
    }
  });

  test("Logout should clear access and refresh tokens", async () => {
    const loginResponse = await request(server)
      .post("/api/v1/auth/login")
      .send({
        email: "abc@gmail.com",
        password: "12345678",
      });

    const { accessToken, refreshToken } = loginResponse.body;

    const logoutResponse = await request(server)
      .post("/api/v1/auth/logout")
      .set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toEqual({ message: "User logged out" });
  });
});
