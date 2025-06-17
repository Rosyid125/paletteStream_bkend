/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_spam_locks", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("spam_type").notNullable(); // 'comment_spam', 'like_spam', etc.
    table.json("spam_data").nullable(); // Detail spam data (post_id, comment_content, etc.)
    table.timestamp("locked_at").defaultTo(knex.fn.now());
    table.timestamp("unlock_at").notNullable(); // Kapan lock berakhir
    table.boolean("is_active").defaultTo(true); // Status lock masih aktif
    table.timestamps(true, true);

    // Foreign key
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");

    // Indexes
    table.index(["user_id", "spam_type", "is_active"]);
    table.index("unlock_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_spam_locks");
};
