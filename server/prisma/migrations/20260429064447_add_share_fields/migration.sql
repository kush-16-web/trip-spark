/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `TripPlan` will be added. If there are existing duplicate values, this will fail.
  - The required column `shareId` was added to the `TripPlan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `TripPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripPlan" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "shareId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TripPlan_shareId_key" ON "TripPlan"("shareId");
