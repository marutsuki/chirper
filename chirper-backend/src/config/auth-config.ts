import { response } from "express";
import { SignOptions } from "jsonwebtoken";

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "chirper.com";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const JWT_ISSUER = process.env.JWT_ISSUER || "marutsuki.io";

export const JWT_SIGN_OPT: SignOptions = {
    expiresIn: "1h",
    algorithm: "HS256",
    issuer: JWT_ISSUER,
};

export const COOKIE_SECRET = process.env.COOKIE_SECRET || "secret";

const base64URLdecode = (str: string) => {
    const base64Encoded = str.replace(/-/g, "+").replace(/_/g, "/");
    const padding =
        str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
    const base64WithPadding = base64Encoded + padding;
    return atob(base64WithPadding)
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0)))
        .join("");
};

export const COOKIE_OPT: Parameters<typeof response.cookie>[1] =
    process.env.NODE_ENV === "prod"
        ? {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              path: "/",
              encode: (value: string) =>
                  Buffer.from(value).toString("base64url"),
              decode: base64URLdecode,
          }
        : {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              path: "/",
              encode: (value: string) =>
                  Buffer.from(value).toString("base64url"),
              decode: base64URLdecode,
          };
