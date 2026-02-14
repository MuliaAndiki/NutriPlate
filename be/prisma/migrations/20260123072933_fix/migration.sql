-- DropForeignKey
ALTER TABLE "subtask_program" DROP CONSTRAINT "subtask_program_progresId_fkey";

-- AddForeignKey
ALTER TABLE "subtask_program" ADD CONSTRAINT "subtask_program_progresId_fkey" FOREIGN KEY ("progresId") REFERENCES "program_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
