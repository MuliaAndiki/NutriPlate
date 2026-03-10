-- DropForeignKey
ALTER TABLE "food_intakes" DROP CONSTRAINT "food_intakes_childId_fkey";

-- AddForeignKey
ALTER TABLE "food_intakes" ADD CONSTRAINT "food_intakes_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
