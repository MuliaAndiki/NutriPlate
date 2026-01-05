-- CreateTable
CREATE TABLE "who_evaluations" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "measurementId" TEXT NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "heightCm" DECIMAL(65,30) NOT NULL,
    "weightKg" DECIMAL(65,30) NOT NULL,
    "zScore" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "recommendation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "who_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "who_evaluations_childId_idx" ON "who_evaluations"("childId");

-- CreateIndex
CREATE INDEX "who_evaluations_measurementId_idx" ON "who_evaluations"("measurementId");

-- AddForeignKey
ALTER TABLE "who_evaluations" ADD CONSTRAINT "who_evaluations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "who_evaluations" ADD CONSTRAINT "who_evaluations_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
