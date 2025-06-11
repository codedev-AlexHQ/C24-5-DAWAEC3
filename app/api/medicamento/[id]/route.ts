import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const medicamento = await prisma.medicamento.findUnique({
    where: { CodMedicamento: Number(params.id) },
    include: { tipoMedic: true, especialidad: true },
  });
  if (!medicamento)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(medicamento);
}

// PUT actualizar
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const medicamento = await prisma.medicamento.update({
    where: { CodMedicamento: Number(params.id) },
    data,
  });
  return NextResponse.json(medicamento);
}

// DELETE eliminar
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.medicamento.delete({
    where: { CodMedicamento: Number(params.id) },
  });
  return NextResponse.json({ message: 'Deleted' });
}