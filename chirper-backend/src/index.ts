import app from "@/app";
import chirpRouter from "@/controller/chirp-controller";
import authRouter from "@/controller/auth-controller";
import userRouter from "@/controller/user-controller";
import followRouter from "@/controller/follow-controller";
import { authenticate } from "@/middleware/auth";

const port = process.env.PORT || 3000;

app.use("/api", authenticate);
app.use("/auth", authRouter);

app.use("/api/chirps", chirpRouter);
app.use("/api/users", userRouter);
app.use("/api/follow", followRouter);

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
