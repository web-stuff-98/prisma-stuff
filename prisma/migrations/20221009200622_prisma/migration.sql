/*
  Warnings:

  - The primary key for the `LikesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `LikesOnPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SharesOnPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SharesOnPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LikesOnPost_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SharesOnPost_pkey" PRIMARY KEY ("id");
