/*
  Warnings:

  - Added the required column `theaterId` to the `ShowTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowTime" ADD COLUMN     "theaterId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Theater" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "capacity" INTEGER,

    CONSTRAINT "Theater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TheaterShowTimes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TheaterShowTimes_AB_unique" ON "_TheaterShowTimes"("A", "B");

-- CreateIndex
CREATE INDEX "_TheaterShowTimes_B_index" ON "_TheaterShowTimes"("B");

-- AddForeignKey
ALTER TABLE "ShowTime" ADD CONSTRAINT "ShowTime_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TheaterShowTimes" ADD CONSTRAINT "_TheaterShowTimes_A_fkey" FOREIGN KEY ("A") REFERENCES "ShowTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TheaterShowTimes" ADD CONSTRAINT "_TheaterShowTimes_B_fkey" FOREIGN KEY ("B") REFERENCES "Theater"("id") ON DELETE CASCADE ON UPDATE CASCADE;
