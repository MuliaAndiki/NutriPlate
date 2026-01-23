-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACK', 'DINNER');

-- AlterTable
ALTER TABLE "subtask_program" ADD COLUMN     "mealType" "MealType",
ADD COLUMN     "targetCarbGram" DOUBLE PRECISION,
ADD COLUMN     "targetEnergyKcal" DOUBLE PRECISION,
ADD COLUMN     "targetFatGram" DOUBLE PRECISION,
ADD COLUMN     "targetFiberGram" DOUBLE PRECISION,
ADD COLUMN     "targetProteinGram" DOUBLE PRECISION;
