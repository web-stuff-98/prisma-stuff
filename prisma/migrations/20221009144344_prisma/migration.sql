/*
  Warnings:

  - The primary key for the `LikesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SharesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `LikesOnPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SharesOnPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_pkey";

-- AlterTable
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "LikesOnPost_id_key" ON "LikesOnPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SharesOnPost_id_key" ON "SharesOnPost"("id");
