/*
  Warnings:

  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
