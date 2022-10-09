/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `LikesOnPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `SharesOnPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LikesOnPost_userId_key";

-- DropIndex
DROP INDEX "SharesOnPost_userId_key";

-- CreateIndex
CREATE INDEX "LikesOnPost_userId_idx" ON "LikesOnPost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPost_postId_key" ON "LikesOnPost"("postId");

-- CreateIndex
CREATE INDEX "SharesOnPost_userId_idx" ON "SharesOnPost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharesOnPost_postId_key" ON "SharesOnPost"("postId");
