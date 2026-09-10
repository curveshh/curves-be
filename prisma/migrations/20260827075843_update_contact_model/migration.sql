/*
  Warnings:

  - You are about to drop the column `phone` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "phone",
ADD COLUMN     "hotline" TEXT,
ALTER COLUMN "id" SET DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Contact_id_seq";
