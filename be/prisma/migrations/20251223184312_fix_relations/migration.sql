-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_posyanduId_fkey";

-- AlterTable
ALTER TABLE "children" ALTER COLUMN "posyanduId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
