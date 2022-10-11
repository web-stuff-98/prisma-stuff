/*
  Warnings:

  - You are about to drop the `CommentOnPostCommentComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentOnPostCommentComment" DROP CONSTRAINT "CommentOnPostCommentComment_commentedOnId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnPostCommentComment" DROP CONSTRAINT "CommentOnPostCommentComment_userId_fkey";

-- AlterTable
ALTER TABLE "CommentOnPost" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "CommentOnPostCommentComment";
