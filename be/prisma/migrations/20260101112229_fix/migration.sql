/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `children` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "children" DROP COLUMN "photoUrl",
ADD COLUMN     "avaChild" TEXT;
