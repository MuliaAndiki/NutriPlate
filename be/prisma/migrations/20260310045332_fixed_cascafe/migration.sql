-- DropForeignKey
ALTER TABLE "measurements" DROP CONSTRAINT "measurements_childId_fkey";

-- DropForeignKey
ALTER TABLE "who_evaluations" DROP CONSTRAINT "who_evaluations_childId_fkey";

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "who_evaluations" ADD CONSTRAINT "who_evaluations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
