import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const jsonParser = bodyParser.json();

const app: Express = express();

const corsOptions: cors.CorsOptions = {
    origin: "http://localhost:5173",
};

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(jsonParser);
app.use(cookieParser());

export default app;
