// Update with your config settings.
import { Knex } from 'knex';

export default {

  development: {
    client: 'sqlite3',
    connection: {
      filename: 'chirper.db',
      flags: ['OPEN_URI', 'OPEN_SHAREDCACHE']
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'chirper_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'chirper_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

} as Record<string, Knex.Config>;
