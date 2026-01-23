-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "kader_registrations" (
    "id" TEXT NOT NULL,
    "kaderId" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kader_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kader_registrations_kaderId_idx" ON "kader_registrations"("kaderId");

-- CreateIndex
CREATE INDEX "kader_registrations_posyanduId_idx" ON "kader_registrations"("posyanduId");

-- CreateIndex
CREATE UNIQUE INDEX "kader_registrations_kaderId_posyanduId_key" ON "kader_registrations"("kaderId", "posyanduId");

-- AddForeignKey
ALTER TABLE "kader_registrations" ADD CONSTRAINT "kader_registrations_kaderId_fkey" FOREIGN KEY ("kaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kader_registrations" ADD CONSTRAINT "kader_registrations_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
