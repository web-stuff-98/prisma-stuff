import redisClient from "./redis";

type Query = {
  rawTags: string;
  rawTerm: string;
};
type Params = {
  page: number;
};

import prisma from "./prisma";

async function getPage(query?: Query, params?: Params) {
  await redisClient?.connect();

  // popular posts, just the first 8 posts with the most likes
  let popular = [];
  const cachedPopularPosts = await redisClient?.get("popular");
  if (cachedPopularPosts) {
    popular = JSON.parse(cachedPopularPosts);
  } else {
    popular = JSON.parse(
      JSON.stringify({
        popular: await prisma.post.findMany({
          where: {
            published: true,
            imagePending: false,
          },
          select: {
            title: true,
            description: true,
            id: true,
            author: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                image: true,
              },
            },
            slug: true,
          },
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          take: 8,
        }),
      })
    );
    const expiration: number = process.env.NODE_ENV === "development" ? 5 : 120;
    await redisClient?.setEx("popular", expiration, JSON.stringify(popular));
  }

  let clientQueryInput: any = {
    pageOffset: 0,
  };
  let rawTags = "";
  let rawTerm = "";
  if (query) {
    /* The users parsed query parameters. Stored as keyname on redis so cached props can be looked up */
    rawTags = query.rawTags;
    rawTerm = query.rawTerm;
    clientQueryInput = {
      pageOffset: Number(Math.max(Number(params?.page) - 1, 0) * 20),
      ...(rawTags
        ? {
            tags: rawTags
              ? String(rawTags)
                  .toLowerCase()
                  .split(" ")
                  .filter((tag: string) => tag.trim() !== "")
                  .map((tag: string) => tag.replace(/[^\w-]+/g, ""))
              : [],
          }
        : rawTerm
        ? {
            term: String(rawTerm)
              .toLowerCase()
              .trim()
              .replaceAll("+", " ")
              .replace(/[^\w-]+/g, ""),
          }
        : {}),
    };

    const cachedProps = await redisClient?.get(
      JSON.stringify(clientQueryInput)
    );
    if (cachedProps) {
      await redisClient?.disconnect();
      return {
        props: { ...JSON.parse(cachedProps), ...popular },
      };
    }
  }

  //using type any because using mode:'sensitive' causes a typescript error for some reason
  const where: any = rawTags
    ? { tags: { some: { name: { in: clientQueryInput.tags } } } }
    : {
        ...(clientQueryInput.term
          ? {
              title: {
                contains: clientQueryInput.term,
                mode: "insensitive",
              },
            }
          : {}),
      };

  const feedQ = await prisma.post.findMany({
    where: {
      published: true,
      imagePending: false,
      ...where,
    },
    select: {
      id: true,
      authorId: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
      author: {
        select: { id: true, name: true, image: true, createdAt: true },
      },
      likes: true,
      shares: true,
      slug: true,
      blur: true,
    },
    orderBy: { createdAt: "desc" },
    skip: clientQueryInput.pageOffset,
    take: 10,
  });
  //add in the comment count.
  let outFeed: any[] = await Promise.all(
    feedQ.map(
      (p: any) =>
        new Promise((resolve, reject) => {
          let cmtCount = 0;
          prisma.commentOnPost
            .findMany({
              where: { postId: p.id },
              select: { CommentOnPostComment: true },
            })
            .then((cmts) => {
              cmts.forEach((cmt) => {
                cmtCount += cmt.CommentOnPostComment.length + 1;
              });
              resolve({
                ...p,
                comments: cmtCount,
              });
            })
            .catch((e) => reject(e));
        })
    )
  );

  // doing 2 queries, to count the total number of posts without page slice.....
  const feedQ_count = await prisma.post.findMany({
    where: {
      published: true,
      imagePending: false,
      ...where,
    },
    select: { id: true },
  });
  const feed = outFeed.map((data: any) => ({
    ...data,
    tags: data.tags.map((tag: any) => tag.name),
  }));

  const props = {
    feed: JSON.parse(JSON.stringify(feed)),
    pageCount: feedQ.length,
    fullCount: feedQ_count.length,
    maxPage: Math.ceil(feedQ_count.length / 20),
    ...popular,
  };

  const key = JSON.stringify(clientQueryInput);
  const expiration = process.env.NODE_ENV === "development" ? 5 : 60;
  await redisClient?.setEx(
    key,
    expiration,
    JSON.stringify({ ...props, ...popular })
  );

  await redisClient?.disconnect();

  return { props };
}

export default getPage