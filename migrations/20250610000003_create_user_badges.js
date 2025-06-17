/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_badges", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE");
    table.string("badge_img").nullable(); // Path to badge image
    table.text("admin_note").nullable(); // Admin note for the winner
    table.timestamp("awarded_at").defaultTo(knex.fn.now());
    table.timestamps(true, true);

    // Ensure unique combination of user and challenge
    table.unique(["user_id", "challenge_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_badges");
};
