// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: process.env.DB_CLIENT || "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "palettestream",
      charset: "utf8mb4",
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
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
    client: process.env.DB_CLIENT || "mysql2",
    connection: {
      host: process.env.DB_HOST || process.env.MYSQLHOST,
      port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
      user: process.env.DB_USER || process.env.MYSQLUSER,
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE,
      charset: "utf8mb4",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  railway: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQLHOST || process.env.RAILWAY_PRIVATE_DOMAIN,
      port: process.env.MYSQLPORT || 3306,
      user: process.env.MYSQLUSER || "root",
      password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
      charset: "utf8mb4",
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
