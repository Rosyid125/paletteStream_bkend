/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_posts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("images").notNullable();
    table.integer("tag_id").unsigned().notNullable().references("id").inTable("post_tags").onDelete("CASCADE"); // Foreign key
    table.enum("type", ["illustration", "manga", "novel"]).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_posts");
};
