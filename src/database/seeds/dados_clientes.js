import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function seed(knex) {
  const csvPath = path.resolve('src', 'database', 'seeds', 'clientes.csv');
  const fileContent = fs.readFileSync(csvPath);
  const clientes = parse(fileContent, { columns: true });

  await knex('clientes').del();
  await knex('clientes').insert(clientes);
}
