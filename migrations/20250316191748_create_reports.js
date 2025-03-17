/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // User being able to report another user, post, comment, message, etc. by pictures, and a note (traditional fast effective way).
  return knex.schema.createTable("reports", (table) => {
    table.increments("id").primary();
    table.integer("reporter_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.string("report_picture").notNullable();
    table.string("note").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("reports");
};
