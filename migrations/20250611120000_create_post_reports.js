/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_reports", (table) => {
    table.increments("id").primary();
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE");
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.enum("reason", ["inappropriate_content", "spam", "harassment", "copyright_violation", "fake_content", "violence", "adult_content", "hate_speech", "other"]).notNullable();
    table.text("additional_info").nullable(); // Optional detailed explanation
    table.enum("status", ["pending", "reviewed", "resolved", "dismissed"]).defaultTo("pending");
    table.timestamps(true, true);

    // Prevent duplicate reports from same user for same post
    table.unique(["post_id", "user_id"]);

    // Indexes for better query performance
    table.index(["post_id"]);
    table.index(["user_id"]);
    table.index(["status"]);
    table.index(["created_at"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("post_reports");
};
