/*
  Warnings:

  - The primary key for the `Share` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the `CategoriesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Share` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_likeId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPosts" DROP CONSTRAINT "LikesOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_postId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_userId_fkey";

-- DropForeignKey
ALTER TABLE "SharesOnPosts" DROP CONSTRAINT "SharesOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "SharesOnPosts" DROP CONSTRAINT "SharesOnPosts_shareId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "Share" DROP CONSTRAINT "Share_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "postId",
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "Share_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "CategoriesOnPosts";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "LikesOnPosts";

-- DropTable
DROP TABLE "SharesOnPosts";

-- DropTable
DROP TABLE "_PostToTag";

-- CreateTable
CREATE TABLE "PostTags" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PostTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostShares" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "shareUserId" TEXT,

    CONSTRAINT "PostShares_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostShares_userId_key" ON "PostShares"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Share_userId_key" ON "Share"("userId");

-- AddForeignKey
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShares" ADD CONSTRAINT "PostShares_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShares" ADD CONSTRAINT "PostShares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShares" ADD CONSTRAINT "PostShares_shareUserId_fkey" FOREIGN KEY ("shareUserId") REFERENCES "Share"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
