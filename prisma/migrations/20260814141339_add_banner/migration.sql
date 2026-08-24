/*
  Warnings:

  - You are about to drop the `membership_inquiries` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PromotionBgType" AS ENUM ('gradient', 'image');

-- DropForeignKey
ALTER TABLE "public"."membership_inquiries" DROP CONSTRAINT "membership_inquiries_clubId_fkey";

-- DropForeignKey
ALTER TABLE "public"."membership_inquiries" DROP CONSTRAINT "membership_inquiries_planId_fkey";

-- DropTable
DROP TABLE "public"."membership_inquiries";

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "extra" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "footerText" TEXT NOT NULL,
    "footerLink" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "bgType" "PromotionBgType" NOT NULL DEFAULT 'gradient',
    "bgFrom" TEXT,
    "bgTo" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "primaryText" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
