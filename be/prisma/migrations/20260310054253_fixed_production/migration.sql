-- DropForeignKey
ALTER TABLE "food_raw_image" DROP CONSTRAINT "food_raw_image_source_food_id_fkey";

-- AddForeignKey
ALTER TABLE "food_raw_image" ADD CONSTRAINT "food_raw_image_source_food_id_fkey" FOREIGN KEY ("source_food_id") REFERENCES "food_intakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
