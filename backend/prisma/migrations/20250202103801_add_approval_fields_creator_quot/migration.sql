/*
  Warnings:

  - You are about to alter the column `approved_by` on the `Quotation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `updated_at` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_approved_by_fkey";

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(255),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "approved_by" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "Quotation_approved_by_idx" ON "Quotation"("approved_by");

-- CreateIndex
CREATE INDEX "Quotation_created_by_idx" ON "Quotation"("created_by");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
