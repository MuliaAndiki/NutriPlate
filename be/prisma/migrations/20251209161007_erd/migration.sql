/*
  Warnings:

  - You are about to drop the column `sessionID` on the `users` table. All the data in the column will be lost.
  - Added the required column `ipAddress` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_sessionID_fkey";

-- AlterTable
ALTER TABLE "user_sessions" ADD COLUMN     "ipAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "sessionID";

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
