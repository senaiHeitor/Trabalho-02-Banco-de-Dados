import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function seed(knex) {
  const csvPath = path.resolve('src', 'database', 'seeds', 'marcas.csv');
  const fileContent = fs.readFileSync(csvPath);
  const marcas = parse(fileContent, { columns: true });

  await knex('marcas').del();
  await knex('marcas').insert(marcas);
}
