/*
  Warnings:

  - The primary key for the `LikesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SharesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Share` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `LikesOnPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `SharesOnPost` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_userId_fkey";

-- DropForeignKey
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_userId_fkey";

-- AlterTable
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_pkey",
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "LikesOnPost_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_pkey",
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "SharesOnPost_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "Share";

-- AddForeignKey
ALTER TABLE "SharesOnPost" ADD CONSTRAINT "SharesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPost" ADD CONSTRAINT "LikesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
