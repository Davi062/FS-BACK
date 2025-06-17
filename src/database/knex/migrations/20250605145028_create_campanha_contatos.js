/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campanha_contatos', (table) => {
    table.increments('id');
    table.integer('campanha_id').notNullable();
    table.integer('contato_id').notNullable();
    table.boolean('enviado').defaultTo(false);
    table.timestamp('enviado_em').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Adicionar índices e chaves estrangeiras
    table.foreign('campanha_id').references('id').inTable('campanha').onDelete('CASCADE');
    table.foreign('contato_id').references('id').inTable('contacts').onDelete('CASCADE');
    
    // Criar índice composto para evitar duplicatas
    table.unique(['campanha_id', 'contato_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('campanha_contatos');
};
