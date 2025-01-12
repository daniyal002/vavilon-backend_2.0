/*
  Warnings:

  - The `row` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `seatPerRow` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "row",
ADD COLUMN     "row" INTEGER[],
DROP COLUMN "seatPerRow",
ADD COLUMN     "seatPerRow" INTEGER[];
