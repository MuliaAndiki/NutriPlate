-- CreateTable
CREATE TABLE "who_height_for_age" (
    "id" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "sdMinus3" DOUBLE PRECISION NOT NULL,
    "sdMinus2" DOUBLE PRECISION NOT NULL,
    "sdMinus1" DOUBLE PRECISION NOT NULL,
    "median" DOUBLE PRECISION NOT NULL,
    "sdPlus1" DOUBLE PRECISION NOT NULL,
    "sdPlus2" DOUBLE PRECISION NOT NULL,
    "sdPlus3" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "who_height_for_age_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "who_height_for_age_gender_ageMonths_key" ON "who_height_for_age"("gender", "ageMonths");
