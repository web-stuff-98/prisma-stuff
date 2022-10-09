/*
  Warnings:

  - You are about to drop the column `id` on the `LikesOnPost` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SharesOnPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `LikesOnPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SharesOnPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LikesOnPost_id_userId_key";

-- DropIndex
DROP INDEX "SharesOnPost_id_userId_key";

-- AlterTable
ALTER TABLE "LikesOnPost" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "SharesOnPost" DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPost_userId_key" ON "LikesOnPost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharesOnPost_userId_key" ON "SharesOnPost"("userId");
