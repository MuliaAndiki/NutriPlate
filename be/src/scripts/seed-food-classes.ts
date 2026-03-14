import foodClasses from '../data/food-classes.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFoodClasses() {
  console.log('🌱 Sync FoodClasses');

  for (const item of foodClasses) {
    await prisma.foodClasses.upsert({
      where: { name: item.name },

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
        fiberGram: item.fiberGram ?? null,
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
        fiberGram: item.fiberGram ?? null,
        metadata: item.metadata ?? undefined,
      },
    });

    console.log(`✔ synced: ${item.name}`);
  }

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
