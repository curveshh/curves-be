-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('PAGE', 'LINK');

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "MenuType" NOT NULL DEFAULT 'PAGE',
    "href" TEXT,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_posts" (
    "menuId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "menu_posts_pkey" PRIMARY KEY ("menuId", "postId")
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_slug_key" ON "menu_items"("slug");
CREATE INDEX "menu_items_parentId_isActive_sortOrder_idx" ON "menu_items"("parentId", "isActive", "sortOrder");
CREATE INDEX "menu_posts_postId_idx" ON "menu_posts"("postId");
CREATE INDEX "menu_posts_menuId_sortOrder_idx" ON "menu_posts"("menuId", "sortOrder");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_posts" ADD CONSTRAINT "menu_posts_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_posts" ADD CONSTRAINT "menu_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "news_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
