/*
  Warnings:

  - Changed the type of `buyAt` on the `Crypto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `soldAt` on the `Crypto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transactionFee` on the `Crypto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Crypto" DROP COLUMN "buyAt",
ADD COLUMN     "buyAt" INTEGER NOT NULL,
DROP COLUMN "soldAt",
ADD COLUMN     "soldAt" INTEGER NOT NULL,
DROP COLUMN "transactionFee",
ADD COLUMN     "transactionFee" INTEGER NOT NULL;
