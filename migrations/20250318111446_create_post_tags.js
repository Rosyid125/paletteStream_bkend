/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_tags", (table) => {
    table.increments("id").primary();
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE"); // Foreign key
    table.integer("tag_id").unsigned().notNullable().references("id").inTable("tags").onDelete("CASCADE"); // Foreign key
    table.timestamps(true, true);

    // Add unique constraint
    table.unique(["post_id", "tag_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("post_tags");
};
