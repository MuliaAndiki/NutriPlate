/*
  Warnings:

  - You are about to drop the column `bboxHeight` on the `food_intake_items` table. All the data in the column will be lost.
  - You are about to drop the column `bboxWidth` on the `food_intake_items` table. All the data in the column will be lost.
  - You are about to drop the column `bboxX` on the `food_intake_items` table. All the data in the column will be lost.
  - You are about to drop the column `bboxY` on the `food_intake_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_intake_items" DROP COLUMN "bboxHeight",
DROP COLUMN "bboxWidth",
DROP COLUMN "bboxX",
DROP COLUMN "bboxY",
ADD COLUMN     "bboxData" JSONB;

-- CreateIndex
CREATE INDEX "food_intake_items_foodClassName_idx" ON "food_intake_items"("foodClassName");

-- CreateIndex
CREATE INDEX "food_intakes_createdAt_idx" ON "food_intakes"("createdAt");
