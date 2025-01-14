/*
  Warnings:

  - You are about to drop the column `complement2` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "complement2",
ADD COLUMN     "name" TEXT;
