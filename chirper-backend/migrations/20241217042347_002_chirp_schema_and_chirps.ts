import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createSchema('chirp').withSchema('chirp')
        .createTable('chirps', (table) => {
            table.increments('id');
            table.bigInteger('user_id')
                .unsigned()
                .references('id')
                .inTable('iam.users')
                .notNullable();
            table.string('text_content', 255).notNullable();
            table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema('chirp')
        .dropTable('chirps')
        .dropSchema('chirp');
}

