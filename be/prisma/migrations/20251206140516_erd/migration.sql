-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('PARENT', 'KADER', 'POSYANDU', 'ADMIN');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "IotStatus" AS ENUM ('online', 'offline', 'error');

-- CreateEnum
CREATE TYPE "NutritionStatus" AS ENUM ('severely_underweight', 'underweight', 'normal', 'overweight');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('result', 'reminder', 'alert', 'edukasi');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "fullName" TEXT NOT NULL,
    "password" TEXT,
    "role" "RoleType" NOT NULL,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "expOtp" TIMESTAMP(3),
    "token" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activateExp" TIMESTAMP(3),
    "activateToken" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "GenderType" NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileChild" JSONB NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "scheduleDay" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avaUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iot_devices" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "posyanduId" TEXT,
    "macAddress" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "pairingToken" TEXT,
    "pairingExpiresAt" TIMESTAMP(3),
    "batteryLevel" INTEGER,
    "lastOnline" TIMESTAMP(3),
    "status" "IotStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iot_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "measurementDate" TIMESTAMP(3) NOT NULL,
    "weightKg" DECIMAL(65,30) NOT NULL,
    "heightCm" DECIMAL(65,30) NOT NULL,
    "headCircumferenceCm" DECIMAL(65,30),
    "nutritionStatus" "NutritionStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_intakes" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "iotId" TEXT,
    "photoUrl" TEXT,
    "foodLabel" TEXT,
    "mlConfidence" DECIMAL(65,30),
    "weightGram" DECIMAL(65,30),
    "energyKcal" DECIMAL(65,30),
    "proteinGram" DECIMAL(65,30),
    "fatGram" DECIMAL(65,30),
    "carbGram" DECIMAL(65,30),
    "vitamins" JSONB,
    "nutritionScore" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotifType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutriplate_programs" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutriplate_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_progress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "children_parentId_idx" ON "children"("parentId");

-- CreateIndex
CREATE INDEX "children_posyanduId_idx" ON "children"("posyanduId");

-- CreateIndex
CREATE UNIQUE INDEX "iot_devices_macAddress_key" ON "iot_devices"("macAddress");

-- CreateIndex
CREATE INDEX "iot_devices_parentId_idx" ON "iot_devices"("parentId");

-- CreateIndex
CREATE INDEX "iot_devices_posyanduId_idx" ON "iot_devices"("posyanduId");

-- CreateIndex
CREATE INDEX "measurements_childId_idx" ON "measurements"("childId");

-- CreateIndex
CREATE INDEX "food_intakes_childId_idx" ON "food_intakes"("childId");

-- CreateIndex
CREATE INDEX "food_intakes_iotId_idx" ON "food_intakes"("iotId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "nutriplate_programs_posyanduId_idx" ON "nutriplate_programs"("posyanduId");

-- CreateIndex
CREATE INDEX "program_progress_childId_idx" ON "program_progress"("childId");

-- CreateIndex
CREATE INDEX "program_progress_programId_idx" ON "program_progress"("programId");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu" ADD CONSTRAINT "posyandu_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iot_devices" ADD CONSTRAINT "iot_devices_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iot_devices" ADD CONSTRAINT "iot_devices_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_intakes" ADD CONSTRAINT "food_intakes_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_intakes" ADD CONSTRAINT "food_intakes_iotId_fkey" FOREIGN KEY ("iotId") REFERENCES "iot_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutriplate_programs" ADD CONSTRAINT "nutriplate_programs_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_progress" ADD CONSTRAINT "program_progress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_progress" ADD CONSTRAINT "program_progress_programId_fkey" FOREIGN KEY ("programId") REFERENCES "nutriplate_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
