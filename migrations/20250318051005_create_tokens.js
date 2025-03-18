/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.increments("id");
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("refresh_token").notNullable();
    table.string("expires_at").notNullable();
    table.timestamps(true, true);

    // Unique constraint
    table.unique("refresh_token");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tokens");
};
