/*
  Warnings:

  - Added the required column `totalCalciumMg` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCarbGram` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEnergyKcal` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFatGram` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFiberGram` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalIronMg` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalProteinGram` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalVitaminA` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalVitaminC` to the `food_intakes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_intakes" ADD COLUMN     "totalCalciumMg" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalCarbGram" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalEnergyKcal" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalFatGram" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalFiberGram" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalIronMg" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalProteinGram" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalVitaminA" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalVitaminC" DECIMAL(65,30) NOT NULL;
