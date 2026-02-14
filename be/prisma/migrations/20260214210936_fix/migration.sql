/*
  Warnings:

  - You are about to drop the column `macAddress` on the `iot_devices` table. All the data in the column will be lost.
  - You are about to drop the column `pairingExpiresAt` on the `iot_devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deviceToken]` on the table `iot_devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceToken` to the `iot_devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "iot_devices_macAddress_key";

-- DropIndex
DROP INDEX "iot_devices_parentId_idx";

-- DropIndex
DROP INDEX "iot_devices_posyanduId_idx";

-- AlterTable
ALTER TABLE "iot_devices" DROP COLUMN "macAddress",
DROP COLUMN "pairingExpiresAt",
ADD COLUMN     "command" JSONB,
ADD COLUMN     "deviceToken" TEXT NOT NULL,
ADD COLUMN     "firmwareVersion" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastStableWeight" DOUBLE PRECISION,
ADD COLUMN     "lastStatus" TEXT,
ADD COLUMN     "lastWeight" DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'offline';

-- CreateIndex
CREATE UNIQUE INDEX "iot_devices_deviceToken_key" ON "iot_devices"("deviceToken");

-- AddForeignKey
ALTER TABLE "food_intakes" ADD CONSTRAINT "food_intakes_iotId_fkey" FOREIGN KEY ("iotId") REFERENCES "iot_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
