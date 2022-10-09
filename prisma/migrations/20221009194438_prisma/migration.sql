/*
  Warnings:

  - The required column `id` was added to the `LikesOnPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SharesOnPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "LikesOnPost_postId_key";

-- DropIndex
DROP INDEX "SharesOnPost_postId_key";

-- AlterTable
ALTER TABLE "LikesOnPost" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikesOnPost_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SharesOnPost" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SharesOnPost_pkey" PRIMARY KEY ("id");
