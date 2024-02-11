import User from "@/model/user";
import {
    createChirp,
    deleteChirpById,
    getAllChirps,
    getChirpById,
    updateChirpById,
} from "@/service/chirp-service";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (_: Request, res: Response) => {
    try {
        const chirps = await getAllChirps();
        res.json(chirps);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const chirp = await getChirpById(parseInt(id));
        if (chirp) {
            res.json(chirp);
        } else {
            res.status(404).json({ error: "Chirp not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { text_content } = req.body;

    const uid = (req.user as User).id;
    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const newChirp = await createChirp({ text_content, user_id: uid });
        res.status(201).json(newChirp);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text_content } = req.body;

    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (uid !== (await getChirpById(parseInt(id))).user_id) {
        // User is not the owner of the chirp, so do not action the request
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    try {
        const updatedChirp = await updateChirpById(parseInt(id), {
            text_content,
        });
        if (updatedChirp) {
            res.json(updatedChirp);
        } else {
            res.status(404).json({ error: "Chirp not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const uid = (req.user as User).id;

    if (uid === undefined) {
        // User is not authenticated, so do not action the request
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (uid !== (await getChirpById(parseInt(id))).user_id) {
        // User is not the owner of the chirp, so do not action the request
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    try {
        const deletedChirp = await deleteChirpById(parseInt(id));
        if (deletedChirp) {
            res.json(id);
        } else {
            res.status(404).json({ error: "Chirp not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
