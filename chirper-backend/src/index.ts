import app from '@/app';
import { Request, Response } from 'express';
import chirpRouter from "@/controller/chirp-controller";
import authRouter from "@/controller/auth-controller";
import userRouter from "@/controller/user-controller";

import { authenticate } from './middleware/auth';

const port = process.env.PORT || 3000;

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use("/api", authenticate);
app.use("/auth", authRouter);

app.use("/api/chirps", chirpRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});