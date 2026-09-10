-- CreateEnum
CREATE TYPE "MessengerStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "zalo" TEXT,
    "facebookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookMessengerRecipient" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "psid" TEXT NOT NULL,
    "status" "MessengerStatus" NOT NULL DEFAULT 'CONNECTED',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookMessengerRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessengerCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessengerCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessengerMessage" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "providerMessageId" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessengerMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_facebookUrl_idx" ON "Customer"("facebookUrl");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookMessengerRecipient_customerId_key" ON "FacebookMessengerRecipient"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookMessengerRecipient_psid_key" ON "FacebookMessengerRecipient"("psid");

-- CreateIndex
CREATE INDEX "FacebookMessengerRecipient_status_idx" ON "FacebookMessengerRecipient"("status");

-- CreateIndex
CREATE INDEX "MessengerMessage_campaignId_idx" ON "MessengerMessage"("campaignId");

-- CreateIndex
CREATE INDEX "MessengerMessage_recipientId_idx" ON "MessengerMessage"("recipientId");

-- CreateIndex
CREATE INDEX "MessengerMessage_status_idx" ON "MessengerMessage"("status");

-- AddForeignKey
ALTER TABLE "FacebookMessengerRecipient" ADD CONSTRAINT "FacebookMessengerRecipient_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessengerMessage" ADD CONSTRAINT "MessengerMessage_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MessengerCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessengerMessage" ADD CONSTRAINT "MessengerMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "FacebookMessengerRecipient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
