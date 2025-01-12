/*
  Warnings:

  - You are about to drop the column `capacity` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Theater` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TheaterType" AS ENUM ('REGULAR', 'VIP');

-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "capacity",
DROP COLUMN "location",
ADD COLUMN     "rows" INTEGER,
ADD COLUMN     "seatsPerRow" INTEGER,
ADD COLUMN     "type" "TheaterType" NOT NULL DEFAULT 'REGULAR';
