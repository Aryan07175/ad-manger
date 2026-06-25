import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const order_id = request.nextUrl.searchParams.get('order_id');
  const status = request.nextUrl.searchParams.get('status');

  let items = db.line_items as any[];
  if (order_id) items = items.filter((li: any) => li.order_id === parseInt(order_id));
  if (status) items = items.filter((li: any) => li.status === status);

  return NextResponse.json({ line_items: items, total: items.length });
}

export async function POST(request: NextRequest) {
  const db = readDB();
  const body = await request.json();
  const newItem = { id: nextId(db), ...body, created_at: new Date().toISOString() };
  db.line_items.push(newItem);
  writeDB(db);
  return NextResponse.json({ ...newItem, message: `Line item '${newItem.name}' created successfully` }, { status: 201 });
}
