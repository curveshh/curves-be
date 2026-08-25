-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');
CREATE TYPE "PageKey" AS ENUM ('HOME', 'ABOUT', 'CONTACT');
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ProgramLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "tagline" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "email" TEXT,
    "hotline" TEXT,
    "address" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "tiktokUrl" TEXT,
    "googleMapsUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_pages" (
    "id" TEXT NOT NULL,
    "key" "PageKey" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "heroImageUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_pages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "program_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "program_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "training_programs" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "level" "ProgramLevel" NOT NULL DEFAULT 'ALL_LEVELS',
    "durationWeeks" INTEGER,
    "sessionsPerWeek" INTEGER,
    "durationMinutes" INTEGER,
    "benefits" JSONB,
    "schedule" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "training_programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "gallery" JSONB,
    "openingHours" JSONB,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "googleMapsUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "club_amenities" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "club_amenities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "billingMonths" INTEGER NOT NULL DEFAULT 1,
    "commitmentMonths" INTEGER,
    "imageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_posts" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "news_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "news_post_tags_pkey" PRIMARY KEY ("postId", "tagId")
);

CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_inquiries" (
    "id" TEXT NOT NULL,
    "planId" TEXT,
    "clubId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "membership_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "site_pages_key_key" ON "site_pages"("key");
CREATE UNIQUE INDEX "site_pages_slug_key" ON "site_pages"("slug");
CREATE INDEX "site_pages_status_publishedAt_idx" ON "site_pages"("status", "publishedAt");
CREATE UNIQUE INDEX "program_categories_slug_key" ON "program_categories"("slug");
CREATE INDEX "program_categories_isActive_sortOrder_idx" ON "program_categories"("isActive", "sortOrder");
CREATE UNIQUE INDEX "training_programs_slug_key" ON "training_programs"("slug");
CREATE INDEX "training_programs_categoryId_status_sortOrder_idx" ON "training_programs"("categoryId", "status", "sortOrder");
CREATE INDEX "training_programs_status_publishedAt_idx" ON "training_programs"("status", "publishedAt");
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");
CREATE INDEX "clubs_city_isActive_idx" ON "clubs"("city", "isActive");
CREATE INDEX "clubs_isActive_sortOrder_idx" ON "clubs"("isActive", "sortOrder");
CREATE UNIQUE INDEX "club_amenities_clubId_name_key" ON "club_amenities"("clubId", "name");
CREATE INDEX "club_amenities_clubId_sortOrder_idx" ON "club_amenities"("clubId", "sortOrder");
CREATE UNIQUE INDEX "membership_plans_slug_key" ON "membership_plans"("slug");
CREATE INDEX "membership_plans_isActive_sortOrder_idx" ON "membership_plans"("isActive", "sortOrder");
CREATE INDEX "plan_features_planId_sortOrder_idx" ON "plan_features"("planId", "sortOrder");
CREATE UNIQUE INDEX "news_categories_slug_key" ON "news_categories"("slug");
CREATE UNIQUE INDEX "news_posts_slug_key" ON "news_posts"("slug");
CREATE INDEX "news_posts_categoryId_status_publishedAt_idx" ON "news_posts"("categoryId", "status", "publishedAt");
CREATE INDEX "news_posts_authorId_idx" ON "news_posts"("authorId");
CREATE INDEX "news_posts_status_publishedAt_idx" ON "news_posts"("status", "publishedAt");
CREATE UNIQUE INDEX "news_tags_slug_key" ON "news_tags"("slug");
CREATE INDEX "news_post_tags_tagId_idx" ON "news_post_tags"("tagId");
CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt");
CREATE INDEX "membership_inquiries_planId_idx" ON "membership_inquiries"("planId");
CREATE INDEX "membership_inquiries_clubId_idx" ON "membership_inquiries"("clubId");
CREATE INDEX "membership_inquiries_status_createdAt_idx" ON "membership_inquiries"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "training_programs" ADD CONSTRAINT "training_programs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "program_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "club_amenities" ADD CONSTRAINT "club_amenities_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "membership_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "news_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "news_post_tags" ADD CONSTRAINT "news_post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "news_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "news_post_tags" ADD CONSTRAINT "news_post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "news_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "membership_inquiries" ADD CONSTRAINT "membership_inquiries_planId_fkey" FOREIGN KEY ("planId") REFERENCES "membership_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "membership_inquiries" ADD CONSTRAINT "membership_inquiries_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
