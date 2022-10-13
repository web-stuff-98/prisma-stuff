import { Post } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

import Image from "next/image"
import PostAuthor from "../../components/post/PostAuthor";
import { useUsers } from "../../context/UsersContext";
import { useEffect } from "react";
import date from "../../utils/date";

interface IUserProfile {
    name: string,
    image: string,
    shares: string[],
    posts: Post[],
    createdAt: string
}

export default function Profile({ user }: { user: IUserProfile }) {
    const { findUserData, cacheProfileDataForUser } = useUsers()

    useEffect(() => {
        if (!user.shares || user.shares.length === 0) return
        user.shares.forEach((share: any) => {
            cacheProfileDataForUser(share.authorId)
        })
    }, [user.shares])

    return (
        <div className="container mx-auto flex flex-col justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="mx-auto mt-2 flex items-center p-1">
                    <h1 className="text-3xl p-3 text-center">{user.name}</h1>
                    <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-lg">
                        <Image src={user.image} className="absolute" layout="fill" />
                    </div>
                </div>
                account created {date(user.createdAt)}
            </div>
            <div className="flex items-center justify-center p-6">
                <div className="flex flex-col mx-auto">
                    <h2 className="text-2xl text-center">{user.name}'s shares</h2>
                    {user.shares.map((post: any) =>
                        <div key={post.id} className="text-center text-xl p-3 gap-2 flex items-center justify-center flex-col">
                            {post.title}
                            <PostAuthor post={post} authorData={findUserData(post.authorId)} includeLikesAndShares={false} />
                        </div>)}
                </div>
                <div className="flex flex-col mx-auto">
                    <h2 className="text-2xl text-center">{user.name}'s posts</h2>
                    {user.posts.map((post: any) =>
                        <div key={post.id} className="text-center text-xl p-3 gap-2 flex items-center justify-center flex-col">
                            {post.title}
                            <PostAuthor post={post} authorData={findUserData(post.authorId)} includeLikesAndShares={false} />
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const q = await prisma.user.findUnique({
        where: { id: String(params?.uid) },
        select: {
            name: true,
            image: true,
            shares: true,
            posts: true,
            createdAt:true
        },
    })
    const shareIds = q?.shares.map((share: any) => share.postId)
    const getSharesQ = await prisma.post.findMany({
        where: { id: { in: shareIds } }
    })
    let user: any = q
    user.shares = getSharesQ
    return {
        props: { user: JSON.parse(JSON.stringify(user)) },
    };
};