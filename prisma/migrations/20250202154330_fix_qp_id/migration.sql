/*
  Warnings:

  - The primary key for the `QuotationProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "QuotationProduct" DROP CONSTRAINT "QuotationProduct_pkey",
ADD CONSTRAINT "QuotationProduct_pkey" PRIMARY KEY ("quotation_id", "product_id");
