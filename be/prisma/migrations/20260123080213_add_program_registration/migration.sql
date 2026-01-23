-- CreateTable
CREATE TABLE "program_registrations" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "program_registrations_parentId_idx" ON "program_registrations"("parentId");

-- CreateIndex
CREATE INDEX "program_registrations_childId_idx" ON "program_registrations"("childId");

-- CreateIndex
CREATE INDEX "program_registrations_programId_idx" ON "program_registrations"("programId");

-- CreateIndex
CREATE INDEX "program_registrations_posyanduId_idx" ON "program_registrations"("posyanduId");

-- CreateIndex
CREATE UNIQUE INDEX "program_registrations_parentId_childId_programId_key" ON "program_registrations"("parentId", "childId", "programId");

-- AddForeignKey
ALTER TABLE "program_registrations" ADD CONSTRAINT "program_registrations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_registrations" ADD CONSTRAINT "program_registrations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_registrations" ADD CONSTRAINT "program_registrations_programId_fkey" FOREIGN KEY ("programId") REFERENCES "nutriplate_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_registrations" ADD CONSTRAINT "program_registrations_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
