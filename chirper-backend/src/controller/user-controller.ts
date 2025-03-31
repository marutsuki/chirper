import User from "@/model/user";
import {
    getAllUsers,
    getUserById,
    searchUsers,
    updateUserById,
    updateUserPassword,
} from "@/service/user-service";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (query) {
            const users = await searchUsers(query);
            res.json(users);
        } else {
            const users = await getAllUsers();
            res.json(users);
        }
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
    } catch (error: unknown) {
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

// Update user password
router.put("/:id/password", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Check if the authenticated user is the owner of the account
        if ((req.user as User).id !== userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Current password and new password are required" });
            return;
        }
        
        const success = await updateUserPassword(userId, currentPassword, newPassword);
        
        if (!success) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }
        
        res.json({ message: "Password updated successfully" });
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
