/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("group_posts", (table) => {
    table.increments("id").primary();
    table.integer("group_id").unsigned().notNullable().references("id").inTable("groups").onDelete("CASCADE"); // Foreign key
    table.string("avatar").nullable();
    table.string("bio").nullable();
    table.integer("created_by").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE"); // Foreign key
    table.timestamps(true, true);

    // Add unique constraint
    table.unique("group_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("group_posts");
};
