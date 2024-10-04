/*
  Warnings:

  - The primary key for the `Deposit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `status` on the `Deposit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "amount" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL,
ALTER COLUMN "amount_due" SET DATA TYPE TEXT,
ALTER COLUMN "amount_paid" SET DATA TYPE TEXT,
ALTER COLUMN "receipt" SET DATA TYPE TEXT,
ADD CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Deposit_id_seq";
