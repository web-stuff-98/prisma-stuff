-- CreateTable
CREATE TABLE "CommentOnPost" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentOnPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentOnPostComment" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentOnPostComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentOnPostComment_id_idx" ON "CommentOnPostComment"("id");

-- AddForeignKey
ALTER TABLE "CommentOnPost" ADD CONSTRAINT "CommentOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPost" ADD CONSTRAINT "CommentOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPostComment" ADD CONSTRAINT "CommentOnPostComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentOnPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPostComment" ADD CONSTRAINT "CommentOnPostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
