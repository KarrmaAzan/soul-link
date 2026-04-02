import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "dev_secret";

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

export type AuthTokenPayload = {
  userId: number;
  username: string;
};

export function signToken(payload: AuthTokenPayload) {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}