/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // add column next_treshold to user_exps table
  return knex.schema.table("user_exps", function (table) {
    table.integer("current_treshold").defaultTo(0).after("level");
    table.integer("next_treshold").defaultTo(100).after("current_treshold");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // remove column next_treshold from user_exps table
  return knex.schema.table("user_exps", function (table) {
    table.dropColumn("current_treshold");
    table.dropColumn("next_treshold");
  });
};
