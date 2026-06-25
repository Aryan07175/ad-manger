import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDB(data: object) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function nextId(db: any): number {
  const id = db.next_id;
  db.next_id = id + 1;
  return id;
}
