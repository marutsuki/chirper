import knex from "knex";

const dbEngine = "development"
const config = require("../knexfile")[dbEngine]

export default knex(config)