/*
  Warnings:

  - You are about to drop the column `totalCalciumMg` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalCarbGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalEnergyKcal` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalFatGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalFiberGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalIronMg` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalProteinGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalVitaminA` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `totalVitaminC` on the `food_intakes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_intakes" DROP COLUMN "totalCalciumMg",
DROP COLUMN "totalCarbGram",
DROP COLUMN "totalEnergyKcal",
DROP COLUMN "totalFatGram",
DROP COLUMN "totalFiberGram",
DROP COLUMN "totalIronMg",
DROP COLUMN "totalProteinGram",
DROP COLUMN "totalVitaminA",
DROP COLUMN "totalVitaminC",
ADD COLUMN     "totals" JSONB;
