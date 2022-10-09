import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Auth0Provider from 'next-auth/providers/auth0'
import prisma from '../../../lib/prisma';

//https://next-auth.js.org/getting-started/typescript#module-augmentation

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options:NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: String(process.env.AUTH0_ID),
      clientSecret: String(process.env.AUTH0_SECRET),
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async session({session, token, user}) {
      return {
        ...session,
        uid: user.id,
        user: session.user
      }
    } 
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};