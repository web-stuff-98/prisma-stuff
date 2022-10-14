-- DropForeignKey
ALTER TABLE "CommentOnPost" DROP CONSTRAINT "CommentOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnPost" DROP CONSTRAINT "CommentOnPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnPostComment" DROP CONSTRAINT "CommentOnPostComment_commentedOnId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnPostComment" DROP CONSTRAINT "CommentOnPostComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnPost" DROP CONSTRAINT "LikesOnPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "SharesOnPost" DROP CONSTRAINT "SharesOnPost_userId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharesOnPost" ADD CONSTRAINT "SharesOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharesOnPost" ADD CONSTRAINT "SharesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPost" ADD CONSTRAINT "LikesOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnPost" ADD CONSTRAINT "LikesOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPost" ADD CONSTRAINT "CommentOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPost" ADD CONSTRAINT "CommentOnPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPostComment" ADD CONSTRAINT "CommentOnPostComment_commentedOnId_fkey" FOREIGN KEY ("commentedOnId") REFERENCES "CommentOnPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnPostComment" ADD CONSTRAINT "CommentOnPostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
