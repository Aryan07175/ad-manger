import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const order = db.orders.find((o: any) => o.id === parseInt(id));
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const advertiser = db.advertisers.find((a: any) => a.id === order.advertiser_id);
  const line_items = db.line_items.filter((li: any) => li.order_id === order.id);
  return NextResponse.json({ ...order, advertiser_name: advertiser?.name, line_items, total_line_items: line_items.length });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const idx = db.orders.findIndex((o: any) => o.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const body = await request.json();
  db.orders[idx] = { ...db.orders[idx], ...body };
  writeDB(db);
  return NextResponse.json(db.orders[idx]);
}
