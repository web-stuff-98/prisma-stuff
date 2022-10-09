/*
  Warnings:

  - You are about to drop the column `sharesOnPostPostId` on the `Share` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_sharesOnPostPostId_fkey";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "sharesOnPostPostId";

-- AlterTable
ALTER TABLE "SharesOnPost" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "SharesOnPost" ADD CONSTRAINT "SharesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
