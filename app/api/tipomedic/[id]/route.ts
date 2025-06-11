import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tipo = await prisma.tipoMedic.findUnique({
    where: { CodTipoMed: Number(params.id) },
  });
  if (!tipo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tipo);
}

// PUT actualizar
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const tipo = await prisma.tipoMedic.update({
    where: { CodTipoMed: Number(params.id) },
    data,
  });
  return NextResponse.json(tipo);
}

// DELETE eliminar
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.tipoMedic.delete({
    where: { CodTipoMed: Number(params.id) },
  });
  return NextResponse.json({ message: 'Deleted' });
}