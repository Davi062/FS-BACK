/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('contacts', (table) => {
    table.integer('campanha_id').unsigned().nullable();
    table.boolean('enviado').defaultTo(false);
    table.foreign('campanha_id').references('id').inTable('campanha');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('contacts', (table) => {
    table.dropForeign('campanha_id');
    table.dropColumn('campanha_id');
    table.dropColumn('enviado');
  });
};
