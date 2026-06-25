import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const status = request.nextUrl.searchParams.get('status');
  const search = request.nextUrl.searchParams.get('search')?.toLowerCase();
  const advertiser_id = request.nextUrl.searchParams.get('advertiser_id');

  let orders = db.orders as any[];
  if (status) orders = orders.filter((o: any) => o.status === status);
  if (search) orders = orders.filter((o: any) => o.name.toLowerCase().includes(search));
  if (advertiser_id) orders = orders.filter((o: any) => o.advertiser_id === parseInt(advertiser_id));

  // Attach advertiser info and line items
  const enriched = orders.map((order: any) => {
    const advertiser = db.advertisers.find((a: any) => a.id === order.advertiser_id);
    const line_items = db.line_items.filter((li: any) => li.order_id === order.id);
    return { ...order, advertiser_name: advertiser?.name, line_items };
  });

  return NextResponse.json({ orders: enriched, total: enriched.length });
}

export async function POST(request: NextRequest) {
  const db = readDB();
  const body = await request.json();
  const newOrder = { id: nextId(db), ...body, created_at: new Date().toISOString() };
  db.orders.push(newOrder);
  writeDB(db);
  return NextResponse.json({ ...newOrder, message: `Order '${newOrder.name}' created successfully` }, { status: 201 });
}
