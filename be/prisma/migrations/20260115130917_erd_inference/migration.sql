-- CreateTable
CREATE TABLE "ml_inferences" (
    "inferenceHash" TEXT NOT NULL,
    "detections" JSONB NOT NULL,
    "modelId" TEXT,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ml_inferences_pkey" PRIMARY KEY ("inferenceHash")
);

-- AddForeignKey
ALTER TABLE "ml_inferences" ADD CONSTRAINT "ml_inferences_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ml_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
