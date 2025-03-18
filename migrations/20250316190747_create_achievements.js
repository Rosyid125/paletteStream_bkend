/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("achievements", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("icon").notNullable();
    table.string("description").notNullable();
    table.timestamps(true, true);

    // Add unique constraint
    table.unique(["title", "icon"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("achievements");
};
