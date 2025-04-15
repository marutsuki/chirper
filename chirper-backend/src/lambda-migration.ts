import { Handler } from "aws-lambda";
import knex from "knex";
import logger from "@/config/logging";
import { migrate } from "./migrate";

export const runMigrations: Handler = async (event) => {
    logger.info("Starting database migrations in Lambda");

    logger.info({ event }, "Event trigger");
    
    logger.info({
        NODE_ENV: process.env.NODE_ENV,
        PWD: process.env.PWD,
        LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT,
    }, "Environment variables");

    try {
        const [batchNo, log] = await migrate();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Migrations completed successfully",
                batch: batchNo,
                migrationsRun: log,
            }),
        };
    } catch (error) {
        logger.error(error, "Error running migrations");

        try {
            const db = knex({
                client: "pg",
                connection: process.env.DATABASE_URL,
            });
            await db.destroy();
        } catch (e) {
            logger.error(e, "Error closing database connection");
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error running migrations",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};
