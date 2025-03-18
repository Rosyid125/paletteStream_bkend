/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comment_replies", (table) => {
    table.increments("id").primary();
    table.integer("comment_id").unsigned().notNullable().references("id").inTable("post_comments").onDelete("CASCADE"); // Foreign key
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.string("content").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("comment_replies");
};
