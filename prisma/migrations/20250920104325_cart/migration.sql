/*
  Warnings:

  - You are about to drop the `carts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."carts" DROP CONSTRAINT "carts_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "storeId" TEXT;

-- DropTable
DROP TABLE "public"."carts";

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
