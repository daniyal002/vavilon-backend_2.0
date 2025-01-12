/*
  Warnings:

  - You are about to drop the column `promoCodeId` on the `ShowTime` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShowTime" DROP CONSTRAINT "ShowTime_promoCodeId_fkey";

-- AlterTable
ALTER TABLE "ShowTime" DROP COLUMN "promoCodeId";
