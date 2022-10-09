/*
  Warnings:

  - The primary key for the `LikesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SharesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `LikesOnPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `SharesOnPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikesOnPost_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SharesOnPost_pkey" PRIMARY KEY ("id");
