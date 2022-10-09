-- CreateTable
CREATE TABLE "Share" (
    "userId" TEXT NOT NULL,
    "sharesOnPostPostId" TEXT
);

-- CreateTable
CREATE TABLE "SharesOnPost" (
    "postId" TEXT NOT NULL,

    CONSTRAINT "SharesOnPost_pkey" PRIMARY KEY ("postId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Share_userId_key" ON "Share"("userId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_sharesOnPostPostId_fkey" FOREIGN KEY ("sharesOnPostPostId") REFERENCES "SharesOnPost"("postId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharesOnPost" ADD CONSTRAINT "SharesOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
