/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("group_posts", (table) => {
    table.increments("id").primary();
    table.integer("group_id").unsigned().notNullable().references("id").inTable("groups").onDelete("CASCADE"); // Foreign key
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("images").notNullable();
    table.integer("tag_id").unsigned().notNullable().references("id").inTable("post_tags").onDelete("CASCADE"); // Foreign key
    table.timestamps(true, true);

    table.unique(["group_id", "title"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("group_posts");
};
