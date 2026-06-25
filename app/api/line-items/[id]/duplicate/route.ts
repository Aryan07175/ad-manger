import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const source = db.line_items.find((li: any) => li.id === parseInt(id));
  if (!source) return NextResponse.json({ error: 'Line item not found' }, { status: 404 });
  const { new_name, rename_source } = await request.json();

  let source_line_item = null;
  if (rename_source) {
    const idx = db.line_items.findIndex((li: any) => li.id === parseInt(id));
    db.line_items[idx].name = rename_source;
    source_line_item = { id: source.id, name: rename_source, renamed_to: rename_source };
  }

  const newItem = { ...source, id: nextId(db), name: new_name, status: 'DRAFT', impressions_delivered: 0, clicks_delivered: 0 };
  db.line_items.push(newItem);
  writeDB(db);

  return NextResponse.json({
    source_line_item,
    new_line_item: newItem,
    message: `Line item duplicated successfully as '${new_name}'`
  }, { status: 201 });
}
