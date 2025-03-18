/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("achievements", (table) => {
    // id	user_id	name	description	goal	progress	status
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("icon").notNullable();
    table.string("description").notNullable();
    table.integer("goal").notNullable();
    table.integer("progress").notNullable();
    table.enum("status", ["in-progress", "completed"]).notNullable();
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
