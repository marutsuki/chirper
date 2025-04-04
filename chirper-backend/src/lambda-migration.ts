import { Handler } from 'aws-lambda';
import knex from 'knex';
import path from 'path';
import fs from 'fs';
import logger from '@/config/logging';

// Handler for running migrations
export const runMigrations: Handler = async (event, context) => {
  logger.info('Starting database migrations in Lambda');
  
  try {
    // Initialize knex with the database connection
    const db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: path.join(__dirname, '../migrations'),
        tableName: 'knex_migrations'
      },
      pool: {
        min: 0,
        max: 1,
        idleTimeoutMillis: 120000,
        acquireTimeoutMillis: 30000,
      }
    });

    // Log the migrations directory to help with debugging
    logger.info(`Migrations directory: ${path.join(__dirname, '../migrations')}`);
    
    // List migration files for logging
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'));
    logger.info(`Found migration files: ${JSON.stringify(migrationFiles)}`);

    // Run the migrations
    logger.info('Running migrations...');
    const [batchNo, log] = await db.migrate.latest();
    
    // Log the results
    if (log.length === 0) {
      logger.info('No migrations were run. Database schema is up to date.');
    } else {
      logger.info(`Batch ${batchNo} run: ${log.length} migrations`);
      logger.info(`Migrations completed: ${log.join(', ')}`);
    }

    // Close the database connection
    await db.destroy();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Migrations completed successfully',
        batch: batchNo,
        migrationsRun: log
      })
    };
  } catch (error) {
    logger.error(error, 'Error running migrations');
    
    // Attempt to close any open connections
    try {
      const db = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL
      });
      await db.destroy();
    } catch (e) {
      logger.error(e, 'Error closing database connection');
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error running migrations',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
