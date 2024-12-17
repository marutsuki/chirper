import { createUser, getUserByUsername } from "@/service/user-service";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "@/config/logging";
import { JWT_AUDIENCE, JWT_SECRET, JWT_SIGN_OPT } from "@/config/auth-config";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (user !== null && (await bcrypt.compare(password, user.password))) {
            logger.info({ userId: user.id }, "User logged in");
            const token = jwt.sign(
                { sub: user.id, aud: JWT_AUDIENCE },
                JWT_SECRET,
                JWT_SIGN_OPT
            );
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error: unknown) {
        logger.error(error, "An error occurred while logging in");
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        await createUser({ username, email, password });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: unknown) {
        logger.error(error, "Error registering user: ");
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
