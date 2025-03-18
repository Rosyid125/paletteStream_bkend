/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_comments", (table) => {
    table.increments("id").primary();
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE"); // Foreign key
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.string("content").notNullable();
    table.integer("likes").unsigned().defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("post_comments");
};
