/*
  Warnings:

  - You are about to drop the column `commentId` on the `CommentOnPostComment` table. All the data in the column will be lost.
  - Added the required column `comment` to the `CommentOnPostComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentedOnId` to the `CommentOnPostComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentOnPostComment" DROP CONSTRAINT "CommentOnPostComment_commentId_fkey";

-- AlterTable
ALTER TABLE "CommentOnPostComment" DROP COLUMN "commentId",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "commentedOnId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentOnPostComment" ADD CONSTRAINT "CommentOnPostComment_commentedOnId_fkey" FOREIGN KEY ("commentedOnId") REFERENCES "CommentOnPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
