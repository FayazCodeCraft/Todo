import jwt, { type Secret } from "jsonwebtoken";
import { UserAuthenticationManager } from "../model/authenticationModel.js";

/**
 * Generates an access JWT for a given user ID.
 * @param userID - The user ID for whom the access JWT is generated.
 * @returns  The generated access JWT.
 */
export const accessJWTGenerator = (userID: string): string => {
  const jwtSecret = process.env.JWT_ACCESS_SECRET as Secret;
  return jwt.sign({ userID }, jwtSecret, {
    expiresIn: process.env.JWT_ACCSESS_LIFETIME,
  });
};

/**
 * Generates a refresh JWT for a given user ID.
 * @param userID - The user ID for whom the refresh JWT is generated.
 * @returns The generated refresh JWT.
 */
export const refreshJWTGenerator = (userID: string): string => {
  const jwtSecret = process.env.JWT_REFRESH_SECRET as Secret;
  return jwt.sign({ userID }, jwtSecret, {
    expiresIn: process.env.JWT_REFRESH_LIFETIME,
  });
};

/**
 * Generates an access JWT and a refresh JWT for a given user ID.
 * @param userID - The user ID for whom the tokens are generated.
 * @returns  A Promise that resolves to an object containing the access and refresh tokens.
 */
export const generateAccessTokenAndRefreshToken = async (
  userID: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const accessToken = accessJWTGenerator(userID);
  const refreshToken = refreshJWTGenerator(userID);
  const authManager = UserAuthenticationManager.getInstance();
  await authManager.addRefreshToken(userID, refreshToken);
  return { accessToken, refreshToken };
};
