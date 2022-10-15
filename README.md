This is my other blog / social media / chat app similar to PERN-chat but better because it uses Prisma to handle all the backend SQL and caches data for blog pages on Redis. PERN-chat has obvious problems, this is the new version.

Messages & notifications are handled with Pusher, the UI was built out with TailwindCSS.

Features :
 - Paginate and filter by tags on the server side
 - Start a conversation with another user by clicking on their image
 - Like and share posts
 - View a users profile with their shares and likes
 - Create, edit and delete blog posts
 - Delete your account and change your username
 - Signin with Auth0 (tested with gmail, Next js image domain config not configured to work with other login providers)
 - Comment on a comment (but you can't comment on a comment on a comment)

It is missing chatrooms and file attachments, because I couldn't be bothered to add them in this time, also profile pictures cannot be customized and username updates won't show up for other users without a refresh.