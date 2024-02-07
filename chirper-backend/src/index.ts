import app from '@/app';
import { Request, Response } from 'express';
import chirpRouter from "@/controller/chirp-controller";

const port = process.env.PORT || 3000;

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use("/chirps", chirpRouter);

app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});