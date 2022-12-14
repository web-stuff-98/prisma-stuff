import Image from "next/image";
import Link from "next/link";
import { useFilter } from "../../context/FilterContext";
import { useUsers } from "../../context/UsersContext";
import User from "../User";

export type IPost = {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  author: { name: string; image: string; id: string; createdAt: Date };
  shares: string[];
  likes: string[];
  comments: number;
  createdAt: string;
  blur: string;
};

export default function Post({
  post,
  reverse,
}: {
  post: IPost;
  reverse: boolean;
}) {
  const { autoAddRemoveSearchTag, searchTags } = useFilter();

  return (
    <article
      className={`p-2 md:pl-2 text-center gap-1 sm:flex-col md:flex ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } h-full w-full justify-evenly`}
    >
      <Link href={`/blog/post/${post.slug}`}>
        <div className="relative border border-zinc-700 shadow-md cursor-pointer sm:w-full sm:h-28 md:w-64 md:min-w-postWidth md:max-w-postWidth md:h-postHeight bg-gray-200 shadow rounded overflow-hidden shadow">
          <Image
            layout="fill"
            objectFit="cover"
            objectPosition="absolute"
            blurDataURL={post.blur}
            placeholder="blur"
            src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${
              process.env.NODE_ENV === "development" ? "/dev" : ""
            }/${post.id}`}
          />
        </div>
      </Link>
      <div
        className={`flex flex-col justify-center items-${
          reverse ? "end" : "start"
        } mx-auto grow p-1`}
      >
        <h3
          style={{ lineHeight: "0.866" }}
          className={`font-Archivo sm:text-sm md:text-lg sm:mx-auto md:mx-0 sm:py-1 sm:text-center ${
            reverse ? "md:text-right" : "md:text-left"
          } font-black`}
        >
          {post.title}
        </h3>
        <p
          style={{ lineHeight: "0.95" }}
          className={`sm:text-center sm:text-xs sm:mx-auto md:mx-0 text-sm ${
            reverse ? "md:text-right" : "md:text-left"
          }`}
        >
          {post.description}
        </p>
        <div
          style={{ filter: "drop-shadow(0px 1.5px 1px rgba(0,0,0,0.5))" }}
          className={`flex py-1 flex-wrap sm:justify-center ${
            reverse ? "md:justify-end" : "md:justify-start"
          } items-start w-full gap-0.5`}
        >
          {post.tags.map((tag: string) => (
            <div
              onClick={() => autoAddRemoveSearchTag(tag.trim())}
              key={tag}
              style={
                searchTags.includes(tag)
                  ? {
                      filter: "opacity(0.5) saturate(0)",
                    }
                  : {}
              }
              className="text-xs rounded cursor-pointer bg-gray-900 hover:bg-gray-800 text-white hover:bg-gray-600 py-0.5 px-1 sm:py-0 dark:bg-amber-700 dark:hover:bg-amber-600 dark:border-zinc-200 dark:border"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="sm:mx-auto mt-1 md:mx-0">
          <User
            key={post.id}
            reverse={reverse}
            userData={post.author}
            post={post}
          />
        </div>
        <div
          className={`text-xs pt-1 w-full sm:text-center ${
            reverse ? "md:text-right" : "md:text-left"
          } text-zinc-800 dark:text-zinc-500`}
        >
          {post.comments} comment{post.comments === 1 ? "" : "s"}
        </div>
      </div>
    </article>
  );
}
