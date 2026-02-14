import prisma from 'prisma/client';
import foodClasses from '@/data/food-classes.json';

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
  console.log('🌱 Seeding FoodClasses...');

  for (const item of foodClasses as FoodClassInput[]) {
    await prisma.foodClasses.upsert({
      where: {
        name: item.name,
      },
      update: {
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
      },
      create: {
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
      },
    });

    console.log(`✅ upsert: ${item.name}`);
  }

  console.log('🎉 FoodClasses seed completed');
}

seedFoodClasses()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
