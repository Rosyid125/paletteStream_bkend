/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("challenge_participants", (table) => {
    table.increments("id").primary();
    table.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE"); // Foreign key
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.timestamps(true, true);

    table.unique(["challenge_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("challenge_participants");
};
