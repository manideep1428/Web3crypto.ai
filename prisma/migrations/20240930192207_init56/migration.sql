/*
  Warnings:

  - Changed the type of `amount` on the `Deposit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount_due` on the `Deposit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount_paid` on the `Deposit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL,
DROP COLUMN "amount_due",
ADD COLUMN     "amount_due" INTEGER NOT NULL,
DROP COLUMN "amount_paid",
ADD COLUMN     "amount_paid" INTEGER NOT NULL;
