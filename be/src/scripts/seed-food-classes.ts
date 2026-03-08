import foodClasses from '../data/food-classes.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type FoodClassInput = {
  name: string;
  category?: string | null;
  energyKcal?: number | null;
  proteinGram?: number | null;
  fatGram?: number | null;
  carbGram?: number | null;
  edibleRatio?: number | null;
  calciumMg?: number | null;
  ironMg?: number | null;
  vitaminA?: number | null;
  vitaminC?: number | null;
  metadata?: any;
};

async function seedFoodClasses() {
  console.log('🌱 Sync FoodClasses...');

  const existing = await prisma.foodClasses.findMany({
    select: { name: true },
  });

  const existingMap = new Set(existing.map((e) => e.name));

  const operations = (foodClasses as FoodClassInput[]).map((item) => {
    const data = {
      name: item.name,
      category: item.category ?? null,
      energyKcal: item.energyKcal ?? null,
      proteinGram: item.proteinGram ?? null,
      fatGram: item.fatGram ?? null,
      carbGram: item.carbGram ?? null,
      edibleRatio: item.edibleRatio ?? null,
      calciumMg: item.calciumMg ?? null,
      ironMg: item.ironMg ?? null,
      vitaminA: item.vitaminA ?? null,
      vitaminC: item.vitaminC ?? null,
      metadata: item.metadata ?? undefined,
    };

    if (existingMap.has(item.name)) {
      console.log(`🔄 update: ${item.name}`);
      return prisma.foodClasses.update({
        where: { name: item.name },
        data,
      });
    }

    console.log(`➕ create: ${item.name}`);
    return prisma.foodClasses.create({
      data,
    });
  });

  await prisma.$transaction(operations);

  console.log('🎉 FoodClasses sync completed');
}

seedFoodClasses()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
