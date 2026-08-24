/*
  Warnings:

  - You are about to drop the `news_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."news_posts" DROP CONSTRAINT "news_posts_categoryId_fkey";

-- DropTable
DROP TABLE "public"."news_categories";

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
