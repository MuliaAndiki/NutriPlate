-- DropForeignKey
ALTER TABLE "program_progress" DROP CONSTRAINT "program_progress_childId_fkey";

-- AlterTable
ALTER TABLE "program_progress" ADD COLUMN     "isAccep" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "childId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "program_progress" ADD CONSTRAINT "program_progress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;
