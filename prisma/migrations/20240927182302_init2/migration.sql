/*
  Warnings:

  - The values [Sucess] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `transcationType` on the `Order` table. All the data in the column will be lost.
  - Added the required column `transactionType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Buy', 'Sell');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Pending', 'Success', 'Failed');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "transcationType",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;

-- DropEnum
DROP TYPE "TranscationType";
