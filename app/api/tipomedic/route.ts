import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET all TipoMedic
export async function GET() {
  const tipos = await prisma.tipoMedic.findMany();
  return NextResponse.json(tipos);
}

// POST crear TipoMedic
export async function POST(req: NextRequest) {
  const data = await req.json();
  const tipo = await prisma.tipoMedic.create({ data });
  return NextResponse.json(tipo);
}