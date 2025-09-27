/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('marcas', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
  });

  await knex.schema.createTable('produtos', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.integer('marca_id').unsigned().references('id').inTable('marcas').onDelete('CASCADE');
    table.decimal('preco', 10, 2).notNullable();
    // outros campos conforme CSV
  });

  await knex.schema.createTable('clientes', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable();
    // outros campos conforme CSV
  });

  await knex.schema.createTable('pedidos', table => {
    table.increments('id').primary();
    table.integer('cliente_id').unsigned().references('id').inTable('clientes').onDelete('CASCADE');
    table.date('data').notNullable();
    // outros campos conforme CSV
  });

  await knex.schema.createTable('itens_pedidos', table => {
    table.increments('id').primary();
    table.integer('pedido_id').unsigned().references('id').inTable('pedidos').onDelete('CASCADE');
    table.integer('produto_id').unsigned().references('id').inTable('produtos').onDelete('CASCADE');
    table.integer('quantidade').notNullable();
    table.decimal('preco_unitario', 10, 2).notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('itens_pedidos');
  await knex.schema.dropTableIfExists('pedidos');
  await knex.schema.dropTableIfExists('clientes');
  await knex.schema.dropTableIfExists('produtos');
  await knex.schema.dropTableIfExists('marcas');
}
