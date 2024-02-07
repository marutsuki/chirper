import app from '@/app';
import { Request, Response } from 'express';

const port = process.env.PORT || 3000;

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});