/*
  Warnings:

  - A unique constraint covering the columns `[measurementId]` on the table `who_evaluations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "who_evaluations_measurementId_key" ON "who_evaluations"("measurementId");
