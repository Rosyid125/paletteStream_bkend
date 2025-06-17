/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("auth_otp_register", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().index();
    table.string("otp_hash").notNullable();
    table.integer("resend_count").defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("auth_otp_register");
};
