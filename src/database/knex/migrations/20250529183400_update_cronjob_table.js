/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('cronjob', (table) => {
    table.integer('quantidade').defaultTo(0);
    table.date('data_envio').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('cronjob', (table) => {
    table.dropColumn('quantidade');
    table.dropColumn('data_envio');
  });
};
