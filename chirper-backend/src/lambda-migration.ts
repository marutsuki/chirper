import { Handler } from "aws-lambda";
import knex from "knex";
import path from "path";
import fs from "fs";
import logger from "@/config/logging";

export const runMigrations: Handler = async (event) => {
    logger.info("Starting database migrations in Lambda");

    logger.info({ event }, "Event trigger");
    
    logger.info({
        NODE_ENV: process.env.NODE_ENV,
        PWD: process.env.PWD,
        LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT,
    }, "Environment variables");

    try {
        const migrationsDir = path.join(__dirname, "./migrations");
            
        logger.info(`Using migrations directory: ${migrationsDir}`);
        
        const db = knex({
            client: "pg",
            connection: process.env.DATABASE_URL,
            migrations: {
                directory: migrationsDir,
                tableName: "knex_migrations",
            },
            pool: {
                min: 0,
                max: 1,
                idleTimeoutMillis: 120000,
                acquireTimeoutMillis: 30000,
            },
        });

        try {
            const migrationFiles = fs.readdirSync(migrationsDir);
            logger.info(`Found migration files: ${JSON.stringify(migrationFiles)}`);
        } catch (err) {
            logger.error(err, `Error reading migrations directory: ${migrationsDir}`);
            if (process.env.LAMBDA_TASK_ROOT) {
                try {
                    logger.info(`Contents of LAMBDA_TASK_ROOT: ${fs.readdirSync(process.env.LAMBDA_TASK_ROOT).join(', ')}`);
                } catch (e) {
                    logger.error(e, "Error listing LAMBDA_TASK_ROOT directory");
                }
            }
        }

        logger.info("Running migrations...");
        const [batchNo, log] = await db.migrate.latest();

        if (log.length === 0) {
            logger.info(
                "No migrations were run. Database schema is up to date."
            );
        } else {
            logger.info(`Batch ${batchNo} run: ${log.length} migrations`);
            logger.info(`Migrations completed: ${log.join(", ")}`);
        }

        await db.destroy();

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
