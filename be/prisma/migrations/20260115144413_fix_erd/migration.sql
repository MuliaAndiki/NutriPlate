-- AlterTable
ALTER TABLE "food_classes" ADD COLUMN     "calciumMg" DECIMAL(65,30),
ADD COLUMN     "ironMg" DECIMAL(65,30),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "vitaminA" DECIMAL(65,30),
ADD COLUMN     "vitaminC" DECIMAL(65,30);
