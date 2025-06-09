exports.up = function (knex) {
  return knex.schema.createTable("user_achievements", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("achievement_id").unsigned().notNullable().references("id").inTable("achievements").onDelete("CASCADE");
    table.integer("progress").defaultTo(0).notNullable(); // Per user progress
    table.enum("status", ["in-progress", "completed"]).defaultTo("in-progress").notNullable();
    table.timestamps(true, true); // created_at & updated_at

    table.unique(["user_id", "achievement_id"]); // Agar tidak duplikat
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_achievements");
};
