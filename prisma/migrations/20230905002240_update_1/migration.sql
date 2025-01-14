/*
  Warnings:

  - You are about to drop the column `delivery_deadline` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_time` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_orders_id_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_users_id_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "complement2" TEXT,
ALTER COLUMN "users_id" DROP NOT NULL,
ALTER COLUMN "orders_id" DROP NOT NULL,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivery_deadline",
DROP COLUMN "delivery_time";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_orders_id_fkey" FOREIGN KEY ("orders_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
