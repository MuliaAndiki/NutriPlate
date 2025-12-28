-- CreateTable
CREATE TABLE "subtask_program" (
    "id" TEXT NOT NULL,
    "progresId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isComplated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subtask_program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subtask_program_progresId_idx" ON "subtask_program"("progresId");

-- AddForeignKey
ALTER TABLE "subtask_program" ADD CONSTRAINT "subtask_program_progresId_fkey" FOREIGN KEY ("progresId") REFERENCES "program_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
