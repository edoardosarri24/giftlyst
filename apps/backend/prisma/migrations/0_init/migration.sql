-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'CLAIMED');

-- CreateEnum
CREATE TYPE "PreferenceLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpires" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "imageUrl" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "preference" "PreferenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestAccess" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "customName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestClaim" (
    "itemId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestClaim_pkey" PRIMARY KEY ("itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "GiftList_slug_key" ON "GiftList"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GuestAccess_listId_userId_key" ON "GuestAccess"("listId", "userId");

-- AddForeignKey
ALTER TABLE "GiftList" ADD CONSTRAINT "GiftList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftItem" ADD CONSTRAINT "GiftItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "GiftList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestAccess" ADD CONSTRAINT "GuestAccess_listId_fkey" FOREIGN KEY ("listId") REFERENCES "GiftList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestAccess" ADD CONSTRAINT "GuestAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestClaim" ADD CONSTRAINT "GuestClaim_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "GiftItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestClaim" ADD CONSTRAINT "GuestClaim_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "GuestAccess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

