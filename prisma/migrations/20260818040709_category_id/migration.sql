/*
  Warnings:

  - The primary key for the `news_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `categoryId` column on the `news_posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `news_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."news_posts" DROP CONSTRAINT "news_posts_categoryId_fkey";

-- AlterTable
ALTER TABLE "news_categories" DROP CONSTRAINT "news_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "news_posts" DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER,
ALTER COLUMN "publishedAt" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "news_posts_categoryId_status_publishedAt_idx" ON "news_posts"("categoryId", "status", "publishedAt");

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "news_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
