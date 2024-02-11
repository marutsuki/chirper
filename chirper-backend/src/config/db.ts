import knex from "knex";
import config from "@knexfile";
const dbEngine = process.env.NODE_ENV || "development";

export default knex(config[dbEngine]);
