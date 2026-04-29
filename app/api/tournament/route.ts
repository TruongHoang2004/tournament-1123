import { NextResponse } from 'next/server';
import { initialData } from '@/lib/data';

// Simple in-memory store for demo purposes
let state = { ...initialData };

export async function GET() {
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  const body = await request.json();
  state = { ...state, ...body };
  return NextResponse.json(state);
}
