/*
  Warnings:

  - Changed the type of `type` on the `PromoCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PromoCodeType" AS ENUM ('FIXED', 'PERCENTAGE', 'PRODUCT');

-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "productId" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "PromoCodeType" NOT NULL;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
