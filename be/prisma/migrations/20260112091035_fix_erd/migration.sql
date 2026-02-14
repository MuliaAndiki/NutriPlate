/*
  Warnings:

  - You are about to drop the column `durationDays` on the `nutriplate_programs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nutriplate_programs" DROP COLUMN "durationDays",
ADD COLUMN     "activity" TEXT,
ADD COLUMN     "benefit" TEXT,
ADD COLUMN     "durationRegister" TIMESTAMP(3),
ADD COLUMN     "startPrograms" TIMESTAMP(3);
