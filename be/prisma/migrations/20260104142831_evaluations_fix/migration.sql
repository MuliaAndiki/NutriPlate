/*
  Warnings:

  - Changed the type of `classification` on the `who_evaluations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "who_evaluations_measurementId_idx";

-- AlterTable
ALTER TABLE "who_evaluations" DROP COLUMN "classification",
ADD COLUMN     "classification" JSONB NOT NULL;
