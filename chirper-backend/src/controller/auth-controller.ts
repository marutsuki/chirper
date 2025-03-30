import { createUser, loginUser } from "@/service/user-service";
import express, { Request, Response } from "express";
import logger from "@/config/logging";

const router = express.Router();

router.post("/logout", (_req: Request, res: Response) => {
    // With token in Authorization header, no server-side logout is needed
    // The client will handle removing the token from localStorage
    logger.info("User logged out");
    res.status(200).json({ message: "Logged out successfully" });
});

router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const token = await loginUser(username, password);
        if (token !== null) {
            // Return the token in the response body instead of setting a cookie
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
