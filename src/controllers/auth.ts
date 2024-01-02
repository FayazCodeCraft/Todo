import { type Request, type Response } from "express";
import { TodoManager } from "../db/todo.js";
import { asyncWrapper } from "../utility/async-wrapper.js";
import { comparePassword } from "../utility/comparePassword.js";
import { CustomAPIError, createCustomError } from "../errors/custom-error.js";
import { generateAccessTokenAndRefreshToken } from "../utility/jwtGenerator.js";
import { type AuthenticatedRequest } from "../middlewares/authentication.js";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";

/**
 * Register a new user by validating the request body, creating a new user, and returning the created user.
 */
export const register = asyncWrapper(async (req: Request, res: Response) => {
  const todoManager = TodoManager.getInstance();
  const isUserExist = await todoManager.getUser(req.body.userEmail);
  if (isUserExist) {
    throw createCustomError("User Already Exist", 409);
  }
  const validatedUser = await todoManager.validateUser(req.body);
  const newUser = await todoManager.createUser(validatedUser);
  res.status(201).json(newUser);
});

/**
 *  Log in a user by validating credentials, generating access and refresh tokens,and setting cookies in the response.
 */
export const login = asyncWrapper(async (req: Request, res: Response) => {
  try {
    const todoManager = TodoManager.getInstance();
    const { userEmail, userPassword } = req.body;
    const user = await todoManager.getUser(userEmail);
    if (!user) {
      throw createCustomError("Invalid Credentials", 401);
    }
    const isPasswordCorrect = await comparePassword(
      userPassword,
      user.userPassword,
    );
    if (!isPasswordCorrect) {
      throw createCustomError("Invalid Credentials", 401);
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user.userId);
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    };
    const loggedInUser = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      todos: user.todos,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ loggedInUser, accessToken, refreshToken });
  } catch (error) {
    throw new CustomAPIError("Invalid Credentials", 401);
  }
});

/**
 *  Log out a user by clearing the access and refresh tokens stored in cookies.
 */
export const logout = asyncWrapper(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out" });
});

/**
 * Refresh access and refresh tokens for an authenticated user.
 */
export const refreshTokens = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new CustomAPIError("Unauthorized request", 401);
    }
    try {
      const jwtSecret = process.env.JWT_REFRESH_SECRET as Secret;
      const payload = jwt.verify(incomingRefreshToken, jwtSecret) as JwtPayload;
      const todoManager = TodoManager.getInstance();
      const user = await todoManager.findUserById(payload.userID);
      if (!user) {
        throw new CustomAPIError("Unauthorized request", 401);
      }
      if (incomingRefreshToken !== user.refreshToken) {
        throw new CustomAPIError("Refresh token expiered", 401);
      }
      const options = {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30 * 1000,
      };
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user.userId);
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ accessToken, refreshToken });
    } catch (error) {
      throw new CustomAPIError("Unauthorized request", 401);
    }
  },
);
