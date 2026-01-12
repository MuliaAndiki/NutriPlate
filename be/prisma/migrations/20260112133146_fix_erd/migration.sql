/*
  Warnings:

  - The `activity` column on the `nutriplate_programs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `benefit` column on the `nutriplate_programs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "nutriplate_programs" DROP COLUMN "activity",
ADD COLUMN     "activity" TEXT[],
DROP COLUMN "benefit",
ADD COLUMN     "benefit" TEXT[];
