import knex from "knex";
import logger from "./config/logging";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const migrate = async () => {
    const migrationsDir = path.join(__dirname, "./migrations");
            
    logger.info(`Using migrations directory: ${migrationsDir}`);
    logger.info(`Using database URL: ${process.env.DATABASE_URL}`);

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

    return [batchNo, log];
}

migrate()
    .then(() => {
        logger.info("Migrations completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        logger.error(error, "Error running migrations");
        process.exit(1);
    });