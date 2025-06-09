exports.up = function (knex) {
  return knex.schema.createTable("achievements", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("icon").nullable();
    table.text("description").nullable();
    table.integer("goal").notNullable(); // Target angka (misal: 10 likes)
    table.timestamps(true, true); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("achievements");
};
