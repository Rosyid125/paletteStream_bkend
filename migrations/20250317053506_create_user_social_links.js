/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_social_links", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.string("platform").notNullable(); // Facebook, Twitter, etc.
    table.timestamps(true, true);

    // Unique constraint to make sure 1 user has only 1 link per platform
    table.unique(["user_id", "platform"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_social_links");
};
