/*
  Warnings:

  - You are about to drop the column `document_type` on the `DocumentCounter` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `DocumentCounter` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `DocumentCounter` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DocumentCounter_document_type_year_month_key";

-- AlterTable
ALTER TABLE "DocumentCounter" DROP COLUMN "document_type",
DROP COLUMN "month",
DROP COLUMN "year",
ALTER COLUMN "last_sequence" SET DEFAULT 0;
