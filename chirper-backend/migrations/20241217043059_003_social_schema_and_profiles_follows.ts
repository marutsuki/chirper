import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createSchema('social').withSchema('social')
        .createTable('profiles', (table) => {
            table.increments('id');
            table.bigInteger('user_id')
                .unsigned()
                .references('id')
                .inTable('iam.users')
                .notNullable();
            table.string('bio', 255).notNullable();
            table.string('avatar_url').notNullable();
        })
        .createTable('follows', (table) => {
            table.bigInteger('follower_id')
                .references('id')
                .inTable('iam.users')
                .notNullable();
            table.bigInteger('followee_id')
                .references('id')
                .inTable('iam.users')
                .notNullable();
            table.primary(['follower_id', 'followee_id'])
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema('social')
        .dropTable('profiles')
        .dropTable('follows')
        .dropSchema('social');
}

