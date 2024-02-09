import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

const jsonParser = bodyParser.json();

const app: Express = express();

app.use(jsonParser);
app.use(cookieParser());

export default app;