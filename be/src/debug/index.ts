import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.measurement.findMany({
    include: {
      child: {
        select: {
          id: true,
          posyanduId: true,
        },
      },
    },
  });

  console.log(
    data.map((d) => ({
      measurementId: d.id,
      childId: d.child.id,
      posyanduId: d.child.posyanduId,
    })),
  );
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
