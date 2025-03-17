/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("challenge_prizes", (table) => {
    table.increments("id").primary();
    table.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE"); // Foreign key
    table.integer("achievement_id").unsigned().nullable().references("id").inTable("achievements").onDelete("CASCADE"); // Foreign key
    table.integer("badge_id").unsigned().nullable().references("id").inTable("badges").onDelete("CASCADE"); // Foreign key
    table.integer("exp").nullable();
    table.timestamps(true, true);

    table.unique(["challenge_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("challenge_prizes");
};
