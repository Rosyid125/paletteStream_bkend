/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("challenges", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("badge_img").nullable(); // Path to badge image
    table.datetime("deadline").notNullable();
    table.boolean("is_closed").defaultTo(false);
    table.integer("created_by").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("challenges");
};
