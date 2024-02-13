import User from "@/model/user";
import {
    followUser,
    getAllFollowees,
    getAllFollowers,
    unfollowUser,
} from "@/service/follow-service";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const followers = await getAllFollowers(uid);
        res.json(followers);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/followees", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const followers = await getAllFollowees(uid);
        res.json(followers);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:id", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const follow = await followUser(uid, parseInt(req.params.id));
        if (follow === null) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(follow);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const follow = await unfollowUser(uid, parseInt(req.params.id));
        if (!follow) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "Unfollowed user" });
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
