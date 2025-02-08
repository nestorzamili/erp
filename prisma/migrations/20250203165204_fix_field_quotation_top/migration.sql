/*
  Warnings:

  - The `terms_of_payment` column on the `Quotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "terms_of_payment",
ADD COLUMN     "terms_of_payment" INTEGER;
