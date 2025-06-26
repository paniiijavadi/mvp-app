import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

export async function POST(req) {
  const body = await req.json();
  const { to } = body;

  if (typeof to !== 'number') {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  const file = fs.readFileSync(dataPath, 'utf-8');
  const users = JSON.parse(file);

  const updated = users.map(u =>
    u.id === to ? { ...u, connectionStatus: 'pending' } : u
  );

  fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');

  return NextResponse.json({ success: true });
}
