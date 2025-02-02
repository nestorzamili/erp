-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "approval_status" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "approved_note" TEXT;
