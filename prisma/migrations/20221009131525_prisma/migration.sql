/*
  Warnings:

  - You are about to drop the `PostShares` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Share` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostShares" DROP CONSTRAINT "PostShares_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostShares" DROP CONSTRAINT "PostShares_shareUserId_fkey";

-- DropForeignKey
ALTER TABLE "PostShares" DROP CONSTRAINT "PostShares_userId_fkey";

-- DropTable
DROP TABLE "PostShares";

-- DropTable
DROP TABLE "Share";
