import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createSchema('iam').withSchema('iam')
        .createTable('users', (table) => {
            table.increments('id');
            table.string('username', 40).notNullable();
            table.string('email', 255).notNullable();
            table.string('password').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema('iam').dropTable('users').dropSchema('iam');
}