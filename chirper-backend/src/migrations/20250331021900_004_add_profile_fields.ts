import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.withSchema('social')
        .alterTable('profiles', (table) => {
            table.string('gender_pronouns').nullable();
            table.string('location').nullable();
            table.string('website').nullable();
            table.string('display_name').nullable();
            // Make bio and avatar_url nullable since they might not be provided initially
            table.string('bio', 255).nullable().alter();
            table.string('avatar_url').nullable().alter();
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema('social')
        .alterTable('profiles', (table) => {
            table.dropColumn('gender_pronouns');
            table.dropColumn('location');
            table.dropColumn('website');
            table.dropColumn('display_name');
            // Revert bio and avatar_url to not nullable
            table.string('bio', 255).notNullable().alter();
            table.string('avatar_url').notNullable().alter();
        });
}
