/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_follows", (table) => {
    table.increments("id").primary();
    table.integer("follower_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.integer("followed_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.timestamps(true, true);

    table.unique(["follower_id", "followed_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_follows");
};
