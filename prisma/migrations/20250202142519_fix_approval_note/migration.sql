/*
  Warnings:

  - You are about to drop the column `approved_note` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "approved_note",
ADD COLUMN     "approval_note" TEXT;
