-- CreateEnum
CREATE TYPE "SettingKey" AS ENUM ('ENABLE_PROMOCODE');

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "key" "SettingKey" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");
