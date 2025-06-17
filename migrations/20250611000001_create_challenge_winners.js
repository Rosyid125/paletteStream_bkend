/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("challenge_winners", function (table) {
    table.increments("id").primary();
    table.integer("challenge_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.integer("post_id").unsigned().notNullable();
    table.integer("rank").unsigned().notNullable(); // 1 = first place, 2 = second place, etc.
    table.integer("final_score").unsigned().default(0); // Like count when winner selected
    table.text("admin_note").nullable(); // Note from admin about why they won
    table.timestamp("selected_at").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign("challenge_id").references("id").inTable("challenges").onDelete("CASCADE");
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("post_id").references("id").inTable("user_posts").onDelete("CASCADE");

    // Indexes
    table.index(["challenge_id"]);
    table.index(["user_id"]);
    table.index(["challenge_id", "rank"]);

    // Unique constraint - one user can only win once per challenge
    table.unique(["challenge_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("challenge_winners");
};
