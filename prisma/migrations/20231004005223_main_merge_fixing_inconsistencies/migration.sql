/*
  Warnings:

  - You are about to drop the column `products_id` on the `OrderItem` table. All the data in the column will be lost.
  - The primary key for the `ProductItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductItem` table. All the data in the column will be lost.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_products_id_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "zip_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "products_id",
ADD COLUMN     "sku" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductItem" DROP CONSTRAINT "ProductItem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductItem_pkey" PRIMARY KEY ("sku");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sku_fkey" FOREIGN KEY ("sku") REFERENCES "ProductItem"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;
