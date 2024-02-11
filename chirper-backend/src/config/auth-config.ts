import { SignOptions } from "jsonwebtoken";

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "chirper.com";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const JWT_ISSUER = process.env.JWT_ISSUER || "melonbreads.com";

export const JWT_SIGN_OPT: SignOptions = {
    expiresIn: "1h",
    algorithm: "HS256",
    issuer: "chirper",
};
