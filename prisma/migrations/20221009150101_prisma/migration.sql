/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `LikesOnPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `SharesOnPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LikesOnPost_id_key";

-- DropIndex
DROP INDEX "SharesOnPost_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPost_id_userId_key" ON "LikesOnPost"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharesOnPost_id_userId_key" ON "SharesOnPost"("id", "userId");
