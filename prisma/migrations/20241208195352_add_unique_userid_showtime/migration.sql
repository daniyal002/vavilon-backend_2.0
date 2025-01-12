/*
  Warnings:

  - A unique constraint covering the columns `[userId,showTimeId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_showTimeId_key" ON "Booking"("userId", "showTimeId");
