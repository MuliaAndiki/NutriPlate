/*
  Warnings:

  - You are about to drop the column `carbGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `energyKcal` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `fatGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `foodLabel` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `mlConfidence` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `nutritionScore` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `proteinGram` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `vitamins` on the `food_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `weightGram` on the `food_intakes` table. All the data in the column will be lost.
  - Added the required column `totalWeightGram` to the `food_intakes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `food_intakes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_intakes" DROP COLUMN "carbGram",
DROP COLUMN "energyKcal",
DROP COLUMN "fatGram",
DROP COLUMN "foodLabel",
DROP COLUMN "mlConfidence",
DROP COLUMN "nutritionScore",
DROP COLUMN "proteinGram",
DROP COLUMN "vitamins",
DROP COLUMN "weightGram",
ADD COLUMN     "inferenceHash" TEXT,
ADD COLUMN     "mlModelVersion" TEXT,
ADD COLUMN     "totalWeightGram" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "food_intake_items" (
    "id" TEXT NOT NULL,
    "foodIntakeId" TEXT NOT NULL,
    "foodClassName" TEXT NOT NULL,
    "mlConfidence" DECIMAL(65,30) NOT NULL,
    "areaRatio" DECIMAL(65,30) NOT NULL,
    "weightGram" DECIMAL(65,30) NOT NULL,
    "energyKcal" DECIMAL(65,30),
    "proteinGram" DECIMAL(65,30),
    "fatGram" DECIMAL(65,30),
    "carbGram" DECIMAL(65,30),
    "fiberGram" DECIMAL(65,30),
    "calciumMg" DECIMAL(65,30),
    "ironMg" DECIMAL(65,30),
    "vitaminA" DECIMAL(65,30),
    "vitaminC" DECIMAL(65,30),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_intake_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "food_intake_items_foodIntakeId_idx" ON "food_intake_items"("foodIntakeId");

-- AddForeignKey
ALTER TABLE "food_intake_items" ADD CONSTRAINT "food_intake_items_foodIntakeId_fkey" FOREIGN KEY ("foodIntakeId") REFERENCES "food_intakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
