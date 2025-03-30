import { Request, Response, Router } from "express";
import { getAllFollowees } from "@/service/follow-service";
import User from "@/model/user";
import { getChirpsByUserIds, PaginationParams } from "@/service/chirp-service";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        // Parse pagination parameters
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const cursor = req.query.cursor as string | undefined;
        
        const pagination: PaginationParams = {
            limit,
            cursor
        };

        const followedAccounts = await getAllFollowees(uid);

        const result = await getChirpsByUserIds(
            [uid, ...followedAccounts.map((account) => account.followee_id)],
            pagination
        );

        res.json(result);
    } catch (error) {
        console.error("Error retrieving timeline:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
