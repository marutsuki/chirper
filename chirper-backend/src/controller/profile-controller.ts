import Profile from "@/model/profile";
import {
    getProfileByUserId,
    updateProfileByUserId,
    createDefaultProfile,
} from "@/service/profile-service";
import { Request, Response, Router } from "express";

const router = Router();

// Get profile by user ID
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const profile = await getProfileByUserId(userId);
        
        if (!profile) {
            // If profile doesn't exist, create a default one
            await createDefaultProfile(userId);
            const newProfile = await getProfileByUserId(userId);
            
            if (!newProfile) {
                res.status(404).json({ message: "Profile not found and could not be created" });
                return;
            }
            
            res.json(newProfile);
            return;
        }
        
        res.json(profile);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update profile by user ID
router.put("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // Check if the authenticated user is the owner of the profile
        if ((req.user as any).id !== userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        
        // Get existing profile or create a default one if it doesn't exist
        let profile = await getProfileByUserId(userId);
        
        if (!profile) {
            await createDefaultProfile(userId);
            profile = await getProfileByUserId(userId);
            
            if (!profile) {
                res.status(404).json({ message: "Profile not found and could not be created" });
                return;
            }
        }
        
        // Update the profile
        const updatedProfile = await updateProfileByUserId(userId, req.body as Partial<Profile>);
        
        if (!updatedProfile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        
        res.json(updatedProfile);
    } catch (error: unknown) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
