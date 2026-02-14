-- CreateEnum
CREATE TYPE "DatasetStatus" AS ENUM ('pending_label', 'labeled', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "food_raw_image" (
    "id" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "source_food_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "status" "DatasetStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "labeled_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_raw_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "energyKcal" DECIMAL(65,30),
    "proteinGram" DECIMAL(65,30),
    "fatGram" DECIMAL(65,30),
    "carbGram" DECIMAL(65,30),
    "edibleRatio" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_annotations" (
    "id" TEXT NOT NULL,
    "rawImageId" TEXT NOT NULL,
    "foodClassId" TEXT NOT NULL,
    "xCenter" DOUBLE PRECISION NOT NULL,
    "yCenter" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_annotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ml_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "modelPath" TEXT NOT NULL,
    "metrics" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ml_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "food_classes_name_key" ON "food_classes"("name");

-- CreateIndex
CREATE INDEX "food_annotations_rawImageId_idx" ON "food_annotations"("rawImageId");

-- AddForeignKey
ALTER TABLE "food_raw_image" ADD CONSTRAINT "food_raw_image_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_raw_image" ADD CONSTRAINT "food_raw_image_source_food_id_fkey" FOREIGN KEY ("source_food_id") REFERENCES "food_intakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_annotations" ADD CONSTRAINT "food_annotations_rawImageId_fkey" FOREIGN KEY ("rawImageId") REFERENCES "food_raw_image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_annotations" ADD CONSTRAINT "food_annotations_foodClassId_fkey" FOREIGN KEY ("foodClassId") REFERENCES "food_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
