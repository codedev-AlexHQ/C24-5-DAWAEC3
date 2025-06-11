import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear especialidades básicas
  const especialidades = [
    { descripcionEsp: 'Cardiología' },
    { descripcionEsp: 'Neurología' },
    { descripcionEsp: 'Dermatología' },
    { descripcionEsp: 'Gastroenterología' },
    { descripcionEsp: 'Oncología' },
  ];

  for (const esp of especialidades) {
    const existing = await prisma.especialidad.findFirst({
      where: { descripcionEsp: esp.descripcionEsp }
    });
    
    if (!existing) {
      await prisma.especialidad.create({ data: esp });
    }
  }

  // Crear tipos de medicamento básicos
  const tiposMedic = [
    { descripcion: 'Antibiótico' },
    { descripcion: 'Analgésico' },
    { descripcion: 'Antiinflamatorio' },
    { descripcion: 'Vitamina' },
    { descripcion: 'Antihipertensivo' },
  ];

  for (const tipo of tiposMedic) {
    const existing = await prisma.tipoMedic.findFirst({
      where: { descripcion: tipo.descripcion }
    });
    
    if (!existing) {
      await prisma.tipoMedic.create({ data: tipo });
    }
  }

  console.log('✅ Datos de prueba creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
