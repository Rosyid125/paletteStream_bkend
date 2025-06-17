/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_images", (table) => {
    table.increments("id").primary();
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE"); // Foreign key
    table.string("image_url").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("post_images");
};
