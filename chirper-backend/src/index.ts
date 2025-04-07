import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

import app from "@/app";
import chirpRouter from "@/controller/chirp-controller";
import authRouter from "@/controller/auth-controller";
import userRouter from "@/controller/user-controller";
import followRouter from "@/controller/follow-controller";
import timelineRouter from "@/controller/timeline-controller";
import profileRouter from "@/controller/profile-controller";
import logger from "@/config/logging";
import { authenticate } from "@/middleware/auth";

logger.info("Starting Chirper Backend...");

const port = process.env.PORT || 3000;

app.use("/api", authenticate);
logger.info("Registered authentication middleware");

app.use("/auth", authRouter);

app.use("/api/chirps", chirpRouter);
app.use("/api/users", userRouter);
app.use("/api/follows", followRouter);
app.use("/api/timeline", timelineRouter);
app.use("/api/profiles", profileRouter);

logger.info("Registered API ednpoints");

app.listen(port, () => {
    logger.info({ port }, "Server is running");
});
