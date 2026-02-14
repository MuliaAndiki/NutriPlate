/*
  Warnings:

  - A unique constraint covering the columns `[childId,programId]` on the table `program_progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "program_progress_childId_programId_key" ON "program_progress"("childId", "programId");
