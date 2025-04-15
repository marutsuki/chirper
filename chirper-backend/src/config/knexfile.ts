// Update with your config settings.
import { Knex } from "knex";
import path from "path";

const getConnectionConfig = (env: string): Knex.PgConnectionConfig | string => {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    return {
        host: process.env.POSTGRESDB_HOST || 'localhost',
        database: process.env.POSTGRESDB_DATABASE || 'chirper_db',
        user: process.env.POSTGRESDB_USER || 'postgres',
        password: process.env.POSTGRESDB_PASSWORD || 'password',
        port: parseInt(process.env.POSTGRESDB_PORT || process.env.POSTGRESDB_DOCKER_PORT || '5432'),
        ssl: env === 'production' ? { rejectUnauthorized: false } : undefined
    };
};

const getLambdaPoolConfig = (env: string): Knex.PoolConfig => {
    if (env === 'production' && process.env.AWS_LAMBDA_FUNCTION_NAME) {
        return {
            min: 0,
            max: 1,
            idleTimeoutMillis: 120000,
            acquireTimeoutMillis: 30000,
        };
    }

    return {
        min: 2,
        max: 10,
        idleTimeoutMillis: 300000,
    };
};

export default {
    development: {
        client: "postgresql",
        connection: getConnectionConfig('development'),
        pool: getLambdaPoolConfig('development'),
        migrations: {
            tableName: "knex_migrations",
            directory: path.join(__dirname, "../../", "migrations")
        },
    },

    staging: {
        client: "postgresql",
        connection: getConnectionConfig('staging'),
        pool: getLambdaPoolConfig('staging'),
        migrations: {
            tableName: "knex_migrations",
            directory: path.join(__dirname, "../../", "migrations")
        },
    },

    production: {
        client: "postgresql",
        connection: getConnectionConfig('production'),
        pool: getLambdaPoolConfig('production'),
        migrations: {
            tableName: "knex_migrations",
            directory: path.join(__dirname, "../../", "migrations")
        },
    },
} as Record<string, Knex.Config>;
