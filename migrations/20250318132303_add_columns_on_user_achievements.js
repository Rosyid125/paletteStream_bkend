/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("user_achievements", (table) => {
    table.integer("progress").notNullable().after("achievement_id");
    table.enum("status", ["in-progress", "completed"]).notNullable().after("progress");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("user_achievements", (table) => {
    table.dropColumn("goal");
    table.dropColumn("progress");
    table.dropColumn("status");
  });
};
