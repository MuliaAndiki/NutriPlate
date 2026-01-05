import { GenderType } from '@prisma/client';
import prisma from 'prisma/client';

const WHO_HEIGHT_FOR_AGE_DATA = [
  {
    gender: GenderType.MALE,
    ageMonths: 6,
    sdMinus3: 59.4,
    sdMinus2: 61.5,
    sdMinus1: 63.5,
    median: 65.7,
    sdPlus1: 67.9,
    sdPlus2: 70.0,
    sdPlus3: 72.1,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 6,
    sdMinus3: 57.8,
    sdMinus2: 59.8,
    sdMinus1: 61.8,
    median: 64.0,
    sdPlus1: 66.2,
    sdPlus2: 68.2,
    sdPlus3: 70.2,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 12,
    sdMinus3: 68.8,
    sdMinus2: 71.3,
    sdMinus1: 73.8,
    median: 76.3,
    sdPlus1: 78.8,
    sdPlus2: 81.3,
    sdPlus3: 83.8,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 12,
    sdMinus3: 66.5,
    sdMinus2: 68.9,
    sdMinus1: 71.3,
    median: 73.8,
    sdPlus1: 76.2,
    sdPlus2: 78.6,
    sdPlus3: 81.0,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 18,
    sdMinus3: 75.1,
    sdMinus2: 77.9,
    sdMinus1: 80.7,
    median: 83.5,
    sdPlus1: 86.3,
    sdPlus2: 89.1,
    sdPlus3: 91.9,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 18,
    sdMinus3: 72.6,
    sdMinus2: 75.3,
    sdMinus1: 78.0,
    median: 80.7,
    sdPlus1: 83.4,
    sdPlus2: 86.1,
    sdPlus3: 88.8,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 24,
    sdMinus3: 79.8,
    sdMinus2: 82.8,
    sdMinus1: 85.7,
    median: 88.7,
    sdPlus1: 91.6,
    sdPlus2: 94.6,
    sdPlus3: 97.5,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 24,
    sdMinus3: 78.1,
    sdMinus2: 81.0,
    sdMinus1: 83.9,
    median: 86.8,
    sdPlus1: 89.7,
    sdPlus2: 92.6,
    sdPlus3: 95.5,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 30,
    sdMinus3: 83.7,
    sdMinus2: 86.9,
    sdMinus1: 90.1,
    median: 93.2,
    sdPlus1: 96.4,
    sdPlus2: 99.6,
    sdPlus3: 102.8,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 30,
    sdMinus3: 81.9,
    sdMinus2: 85.0,
    sdMinus1: 88.2,
    median: 91.3,
    sdPlus1: 94.5,
    sdPlus2: 97.6,
    sdPlus3: 100.8,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 36,
    sdMinus3: 87.2,
    sdMinus2: 90.6,
    sdMinus1: 94.0,
    median: 97.4,
    sdPlus1: 100.8,
    sdPlus2: 104.2,
    sdPlus3: 107.6,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 36,
    sdMinus3: 85.3,
    sdMinus2: 88.7,
    sdMinus1: 92.1,
    median: 95.5,
    sdPlus1: 98.9,
    sdPlus2: 102.3,
    sdPlus3: 105.7,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 42,
    sdMinus3: 90.3,
    sdMinus2: 93.9,
    sdMinus1: 97.6,
    median: 101.2,
    sdPlus1: 104.9,
    sdPlus2: 108.5,
    sdPlus3: 112.2,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 42,
    sdMinus3: 88.4,
    sdMinus2: 92.0,
    sdMinus1: 95.6,
    median: 99.2,
    sdPlus1: 102.8,
    sdPlus2: 106.4,
    sdPlus3: 110.0,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 48,
    sdMinus3: 93.0,
    sdMinus2: 96.8,
    sdMinus1: 100.6,
    median: 104.4,
    sdPlus1: 108.2,
    sdPlus2: 112.0,
    sdPlus3: 115.8,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 48,
    sdMinus3: 91.3,
    sdMinus2: 95.0,
    sdMinus1: 98.8,
    median: 102.5,
    sdPlus1: 106.2,
    sdPlus2: 110.0,
    sdPlus3: 113.7,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 54,
    sdMinus3: 95.5,
    sdMinus2: 99.5,
    sdMinus1: 103.5,
    median: 107.5,
    sdPlus1: 111.5,
    sdPlus2: 115.5,
    sdPlus3: 119.5,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 54,
    sdMinus3: 93.9,
    sdMinus2: 97.8,
    sdMinus1: 101.8,
    median: 105.7,
    sdPlus1: 109.7,
    sdPlus2: 113.6,
    sdPlus3: 117.6,
  },

  {
    gender: GenderType.MALE,
    ageMonths: 60,
    sdMinus3: 97.7,
    sdMinus2: 101.9,
    sdMinus1: 106.0,
    median: 110.1,
    sdPlus1: 114.2,
    sdPlus2: 118.4,
    sdPlus3: 122.5,
  },
  {
    gender: GenderType.FEMALE,
    ageMonths: 60,
    sdMinus3: 96.3,
    sdMinus2: 100.4,
    sdMinus1: 104.6,
    median: 108.7,
    sdPlus1: 112.9,
    sdPlus2: 117.0,
    sdPlus3: 121.2,
  },
];

async function seedWhoData() {
  try {
    console.log('🌱 Starting WHO data seed...');

    const existingCount = await prisma.whoHeightForAge.count();
    if (existingCount > 0) {
      console.log(`⚠️  WHO data already exists (${existingCount} records). Skipping seed.`);
      return;
    }

    const created = await prisma.whoHeightForAge.createMany({
      data: WHO_HEIGHT_FOR_AGE_DATA,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully seeded ${created.count} WHO height-for-age records`);
  } catch (error) {
    console.error('❌ Error seeding WHO data:', error);
    throw error;
  }
}

if (import.meta.main) {
  seedWhoData()
    .then(() => {
      console.log('✨ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

export default seedWhoData;
