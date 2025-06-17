/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.table("comment_replies", (table) => {
    table.integer("post_id").unsigned().notNullable().references("id").inTable("user_posts").onDelete("CASCADE").after("id"); // Foreign key
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.table("comment_replies", (table) => {
    table.dropForeign("post_id"); // Drop foreign key constraint first
    table.dropColumn("post_id"); // Then remove the column
  });
};
