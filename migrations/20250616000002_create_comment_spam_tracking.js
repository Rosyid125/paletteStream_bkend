/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comment_spam_tracking", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("post_id").unsigned().notNullable();
    table.string("comment_content", 500).notNullable();
    table.string("content_hash").notNullable(); // Hash dari content untuk deteksi duplicate
    table.timestamps(true, true); // Ini sudah include created_at dan updated_at

    // Foreign keys
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("post_id").references("id").inTable("user_posts").onDelete("CASCADE");

    // Indexes untuk query cepat
    table.index(["user_id", "post_id", "content_hash"]);
    table.index(["user_id", "created_at"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("comment_spam_tracking");
};
