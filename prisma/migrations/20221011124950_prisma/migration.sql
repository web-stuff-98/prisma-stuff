-- CreateTable
CREATE TABLE "CommentOnPostCommentComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "commentedOnId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentOnPostCommentComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentOnPostCommentComment_id_idx" ON "CommentOnPostCommentComment"("id");

-- AddForeignKey
ALTER TABLE "CommentOnPostCommentComment" ADD CONSTRAINT "CommentOnPostCommentComment_commentedOnId_fkey" FOREIGN KEY ("commentedOnId") REFERENCES "CommentOnPostComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPostCommentComment" ADD CONSTRAINT "CommentOnPostCommentComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
