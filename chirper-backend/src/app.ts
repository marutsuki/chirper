import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const jsonParser = bodyParser.json();

const app: Express = express();

const corsOptions: cors.CorsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(jsonParser);

export default app;
