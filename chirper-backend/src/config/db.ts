import pg from 'pg';
import knex from "knex";
import config from "@knexfile";
import logger from "@/config/logging";

const dbEngine = process.env.NODE_ENV || "development";

const db = knex(config[dbEngine]);

logger.info({ environment: dbEngine }, "Database connection initialized");

db.on('error', (err) => {
  logger.error(err, "Database connection error");
  
  // In Lambda, we want to reconnect on errors
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    logger.info("Attempting to reconnect to database (Lambda environment)");
    
    db.destroy().then(() => {
      return knex(config[dbEngine]);
    }).catch(err => {
      logger.error(err, "Failed to reconnect to database");
    });
  }
});

export default db;
