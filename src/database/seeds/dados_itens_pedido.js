import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function seed(knex) {
  const csvPath = path.resolve('src', 'database', 'seeds', 'itens_pedidos.csv');
  const fileContent = fs.readFileSync(csvPath);
  const itensPedidos = parse(fileContent, { columns: true });

  await knex('itens_pedido').del();
  await knex('itens_pedido').insert(itensPedidos);
}
