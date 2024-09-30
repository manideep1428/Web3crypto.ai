/*
  Warnings:

  - Added the required column `amount_due` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_paid` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "amount_due" INTEGER NOT NULL,
ADD COLUMN     "amount_paid" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "receipt" INTEGER NOT NULL;
