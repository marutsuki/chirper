import User from "@/model/user";
import {
    followUser,
    getAllFollowees,
    getAllFollowers,
    unfollowUser,
} from "@/service/follow-service";
import { Request, Response, Router } from "express";
import knex from "@/config/db";

const router = Router();

// Check if the current user is following another user
router.get("/check/:id", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const followeeId = parseInt(req.params.id);
        const follow = await knex("social.follows")
            .where({ 
                follower_id: uid, 
                followee_id: followeeId 
            })
            .first();
        
        res.json({ following: !!follow });
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Follow a user (POST endpoint)
router.post("/follow/:id", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const followeeId = parseInt(req.params.id);
        const follow = await followUser(uid, followeeId);
        if (follow === null) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(follow);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Unfollow a user (POST endpoint)
router.post("/unfollow/:id", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const followeeId = parseInt(req.params.id);
        const result = await unfollowUser(uid, followeeId);
        if (!result) {
            res.status(404).json({ message: "Follow relationship not found" });
            return;
        }
        res.json({ message: "Unfollowed user successfully" });
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
