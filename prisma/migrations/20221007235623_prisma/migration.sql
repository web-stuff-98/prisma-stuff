-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToVote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_key" ON "Vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToVote_AB_unique" ON "_PostToVote"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToVote_B_index" ON "_PostToVote"("B");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToVote" ADD CONSTRAINT "_PostToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToVote" ADD CONSTRAINT "_PostToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
