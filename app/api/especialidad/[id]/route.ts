import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: especialidad por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const especialidad = await prisma.especialidad.findUnique({
      where: { CodEspec: Number(params.id) },
      include: {
        medicamentos: {
          select: {
            CodMedicamento: true,
            descripcionMed: true,
            stock: true,
            precioVentaUni: true,
          }
        }
      }
    });
    if (!especialidad) {
      return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 404 });
    }
    return NextResponse.json(especialidad);
  } catch (error) {
    console.error('Error getting especialidad:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: actualizar especialidad
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const especialidad = await prisma.especialidad.update({
      where: { CodEspec: Number(params.id) },
      data,
    });
    return NextResponse.json(especialidad);
  } catch (error) {
    console.error('Error updating especialidad:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: eliminar especialidad
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    
    // Verificar si hay medicamentos asociados
    const medicamentosCount = await prisma.medicamento.count({
      where: { CodEspec: id }
    });
    
    if (medicamentosCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar la especialidad porque tiene ${medicamentosCount} medicamento(s) asociado(s)` },
        { status: 400 }
      );
    }
    
    await prisma.especialidad.delete({
      where: { CodEspec: id },
    });
    
    return NextResponse.json({ message: 'Especialidad eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting especialidad:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}