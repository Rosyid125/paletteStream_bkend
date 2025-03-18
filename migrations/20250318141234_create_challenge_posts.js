/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("challenge_posts", (table) => {
    table.increments("id").primary();
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE");
    table.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE");
    table.timestamps(true, true);

    // Add unique constraint
    table.unique(["post_id", "challenge_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("challenge_posts");
};
