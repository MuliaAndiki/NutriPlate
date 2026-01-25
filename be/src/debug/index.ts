import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const CHILD_ID = '7c8314dc-98b6-4348-9675-39aafa3d0ff3';

  const JWT_USER_ID = 'b417ae5a-6744-41a3-af7c-69923faf9f59';

  const child = await prisma.child.findUnique({
    where: { id: CHILD_ID },
    select: {
      id: true,
      parentId: true,
    },
  });

  console.log('CHILD:', child);
  console.log('JWT USER ID:', JWT_USER_ID);

  if (!child) {
    console.log(' Child tidak ditemukan');
  } else if (child.parentId === JWT_USER_ID) {
    console.log(' MATCH: Child MILIK parent ini');
  } else {
    console.log(' MISMATCH: Child BUKAN milik parent ini');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
