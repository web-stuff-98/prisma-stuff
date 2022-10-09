/*
  Warnings:

  - Added the required column `name` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_postId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_userId_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnPosts" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikesOnPosts" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "likeId" TEXT NOT NULL,

    CONSTRAINT "LikesOnPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharesOnPosts" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,

    CONSTRAINT "SharesOnPosts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPosts" ADD CONSTRAINT "LikesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPosts" ADD CONSTRAINT "LikesOnPosts_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharesOnPosts" ADD CONSTRAINT "SharesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharesOnPosts" ADD CONSTRAINT "SharesOnPosts_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
