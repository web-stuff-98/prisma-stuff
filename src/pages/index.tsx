export default function About() {
  return (
    <div className="w-full text-center px-2 mx-auto pt-8 h-full flex flex-col items-center justify-start">
      <h1 className="text-4xl font-ArchivoBlack">About Prisma-Stuff</h1>
      <div style={{ lineHeight: "1.166" }} className="p-2">
        <p>
          You can create blog posts with a markdown editor, share and like
          posts, edit posts, comment on posts, search for posts by title and by
          tags and and start conversations with other users by clicking on their
          profile pictures.
        </p>
        <br />
        <p>
          Redis is used for caching page data and page results for search
          inputs, and for simple rate limiting. The cache expires after 60
          seconds, so that is how long you would have to wait to see new posts.
        </p>
      </div>
    </div>
  );
}
