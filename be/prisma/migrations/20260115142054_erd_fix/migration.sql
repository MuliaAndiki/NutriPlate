/*
  Warnings:

  - You are about to drop the `ml_inferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ml_inferences" DROP CONSTRAINT "ml_inferences_modelId_fkey";

-- AlterTable
ALTER TABLE "ml_models" ALTER COLUMN "isActive" DROP DEFAULT;

-- DropTable
DROP TABLE "ml_inferences";
