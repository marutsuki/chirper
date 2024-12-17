// Update with your config settings.
import { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env")})

export default {
    development: {
        client: "postgresql",
        connection: {
            database: process.env.POSTGRESDB_DATABASE,
            user: process.env.POSTGRESDB_USER,
            password: process.env.POSTGRESDB_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },

    staging: {
        client: "postgresql",
        connection: {
            database: "chirper_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            database: "chirper_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
} as Record<string, Knex.Config>;
