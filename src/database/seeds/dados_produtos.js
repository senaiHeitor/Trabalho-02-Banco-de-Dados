import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function seed(knex) {
  const csvPath = path.resolve('src', 'database', 'seeds', 'produtos.csv');
  const fileContent = fs.readFileSync(csvPath);
  const produtos = parse(fileContent, { columns: true });

  await knex('produtos').del();
  await knex('produtos').insert(produtos);
}
