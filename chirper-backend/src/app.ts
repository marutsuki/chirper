import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "@/config/logging";

const jsonParser = bodyParser.json();

const app: Express = express();

// Get allowed origins from environment variable or use default
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"];

// Configure CORS for different environments
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) {
            return callback(null, true);
        }

        if (
            allowedOrigins.includes("*") ||
            allowedOrigins.indexOf(origin) !== -1
        ) {
            callback(null, true);
        } else {
            logger.warn({ origin }, "Request from origin not allowed by CORS");
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(jsonParser);

app.get("/health", (_, res) => {
    res.status(200).json({ status: "up" });
});

export default app;
