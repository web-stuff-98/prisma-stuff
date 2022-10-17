This is my other social blog / chat app similar to PERN-chat but better because it uses Prisma and Redis,
uses markdown, and the UI is built out with TailwindCSS

Features :
 - Search, paginate and filter by tags on the server side, performance assisted by Redis cache
 - Start a conversation with another user by clicking on their image
 - Like and share posts
 - View a users profile with their shares and likes
 - Create, edit and delete blog posts
 - Delete your account and change your username
 - Signin with Auth0 (tested with gmail, Next not configured with other user image providers)
 - Simple custom rate limiter using Redis for certain API routes
 - Comment on posts
 - Comment on a comment (but you can't comment on a comment on a comment).