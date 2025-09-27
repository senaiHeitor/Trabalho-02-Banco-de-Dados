import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function seed(knex) {
  const csvPath = path.resolve('src', 'database', 'seeds', 'pedidos.csv');
  const fileContent = fs.readFileSync(csvPath);
  const pedidos = parse(fileContent, { columns: true });

  await knex('pedidos').del();
  await knex('pedidos').insert(pedidos);
}
