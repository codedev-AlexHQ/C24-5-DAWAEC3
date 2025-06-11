import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
// GET all Medicamento
export async function GET() {
  const medicamentos = await prisma.medicamento.findMany({
    include: { tipoMedic: true, especialidad: true },
  });
  return NextResponse.json(medicamentos);
}

// POST crear Medicamento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validar que CodTipoMed existe
    if (data.CodTipoMed) {
      const tipoMedic = await prisma.tipoMedic.findUnique({
        where: { CodTipoMed: data.CodTipoMed }
      });
      if (!tipoMedic) {
        return NextResponse.json({ error: 'Tipo de medicamento no encontrado' }, { status: 400 });
      }
    }
    
    // Validar que CodEspec existe
    if (data.CodEspec) {
      const especialidad = await prisma.especialidad.findUnique({
        where: { CodEspec: data.CodEspec }
      });
      if (!especialidad) {
        return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 400 });
      }
    }
    
    const medicamento = await prisma.medicamento.create({ data });
    return NextResponse.json(medicamento);
  } catch (error) {
    console.error('Error creating medicamento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}