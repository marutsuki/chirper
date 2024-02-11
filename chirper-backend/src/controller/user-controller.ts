import User from "@/model/user";
import { getAllUsers, getUserById, updateUserById } from "@/service/user-service";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" }); 
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await getUserById(parseInt(req.params.id));
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        if ((req.user as User).id !== parseInt(req.params.id)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const user = await updateUserById(parseInt(req.params.id), req.body);
        res.json(user);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;