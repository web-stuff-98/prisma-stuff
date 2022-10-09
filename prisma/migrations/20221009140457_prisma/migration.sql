-- CreateTable
CREATE TABLE "Like" (
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LikesOnPost" (
    "postId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "LikesOnPost_pkey" PRIMARY KEY ("postId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_key" ON "Like"("userId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPost" ADD CONSTRAINT "LikesOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPost" ADD CONSTRAINT "LikesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
