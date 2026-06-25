import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const item = db.line_items.find((li: any) => li.id === parseInt(id));
  if (!item) return NextResponse.json({ error: 'Line item not found' }, { status: 404 });
  const order = db.orders.find((o: any) => o.id === item.order_id);
  return NextResponse.json({ ...item, order_name: order?.name });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const idx = db.line_items.findIndex((li: any) => li.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: 'Line item not found' }, { status: 404 });
  const body = await request.json();
  db.line_items[idx] = { ...db.line_items[idx], ...body };
  writeDB(db);
  const updated = db.line_items[idx];
  return NextResponse.json({
    ...updated,
    message: `Line item ${id} updated successfully`,
    changes: Object.keys(body)
  });
}
