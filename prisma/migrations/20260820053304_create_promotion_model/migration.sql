/*
  Warnings:

  - The `bgType` column on the `Promotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BannerBgType" AS ENUM ('GRADIENT', 'IMAGE');

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "badge" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "extra" DROP NOT NULL,
ALTER COLUMN "ctaText" DROP NOT NULL,
ALTER COLUMN "footerText" DROP NOT NULL,
ALTER COLUMN "footerLink" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
DROP COLUMN "bgType",
ADD COLUMN     "bgType" "BannerBgType" NOT NULL DEFAULT 'GRADIENT';

-- CreateIndex
CREATE INDEX "Promotion_showOnHome_idx" ON "Promotion"("showOnHome");

-- CreateIndex
CREATE INDEX "Promotion_endDate_idx" ON "Promotion"("endDate");

-- CreateIndex
CREATE INDEX "Promotion_showOnHome_endDate_idx" ON "Promotion"("showOnHome", "endDate");
