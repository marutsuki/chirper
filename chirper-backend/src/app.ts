import express, { Express } from 'express';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const app: Express = express();

app.use(jsonParser);

export default app;