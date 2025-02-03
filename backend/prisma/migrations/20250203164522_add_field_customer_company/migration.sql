/*
  Warnings:

  - A unique constraint covering the columns `[customer_email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customer_code" TEXT,
ADD COLUMN     "customer_company" TEXT,
ADD COLUMN     "customer_email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_email_key" ON "Customer"("customer_email");
