import knex from "knex";
import config from "@knexfile";
const dbEngine = "development";

export default knex(config[dbEngine]);
