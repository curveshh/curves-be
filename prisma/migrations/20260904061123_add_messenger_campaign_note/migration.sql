/*
  Warnings:

  - A unique constraint covering the columns `[channel,psid]` on the table `FacebookMessengerRecipient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MessengerChannel" AS ENUM ('FACEBOOK', 'ZALO');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SENDING', 'COMPLETED', 'PARTIALLY_FAILED');

-- DropIndex
DROP INDEX "public"."FacebookMessengerRecipient_customerId_key";

-- DropIndex
DROP INDEX "public"."FacebookMessengerRecipient_psid_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "FacebookMessengerRecipient" ADD COLUMN     "channel" "MessengerChannel" NOT NULL DEFAULT 'FACEBOOK';

-- AlterTable
ALTER TABLE "MessengerCampaign" ADD COLUMN     "channel" "MessengerChannel" NOT NULL DEFAULT 'FACEBOOK',
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "trial_registrations" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "clubId" TEXT,
    "preferredClub" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "preferredSlot" TEXT,
    "trainingGoal" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trial_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_feedbacks" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "clubId" TEXT,
    "clubName" TEXT NOT NULL,
    "attendanceTime" TEXT,
    "rating" INTEGER NOT NULL,
    "favoriteAspect" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publicationConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_meta" (
    "id" TEXT NOT NULL,
    "channel" "MessengerChannel" NOT NULL,
    "eventType" TEXT,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trial_registrations_phone_idx" ON "trial_registrations"("phone");

-- CreateIndex
CREATE INDEX "trial_registrations_createdAt_idx" ON "trial_registrations"("createdAt");

-- CreateIndex
CREATE INDEX "member_feedbacks_phone_idx" ON "member_feedbacks"("phone");

-- CreateIndex
CREATE INDEX "member_feedbacks_rating_idx" ON "member_feedbacks"("rating");

-- CreateIndex
CREATE INDEX "member_feedbacks_createdAt_idx" ON "member_feedbacks"("createdAt");

-- CreateIndex
CREATE INDEX "webhook_meta_channel_createdAt_idx" ON "webhook_meta"("channel", "createdAt");

-- CreateIndex
CREATE INDEX "FacebookMessengerRecipient_channel_status_idx" ON "FacebookMessengerRecipient"("channel", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookMessengerRecipient_channel_psid_key" ON "FacebookMessengerRecipient"("channel", "psid");
