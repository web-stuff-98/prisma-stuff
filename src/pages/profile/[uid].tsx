import { Post } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import prisma from "../../utils/prisma";

import Image from "next/image"
import User from "../../components/User";
import { useUsers } from "../../context/UsersContext";
import { useEffect } from "react";
import date from "../../utils/date";

interface IUserProfile {
    name: string,
    image: string,
    shares: string[],
    posts: Post[],
    createdAt: string,
    id: string
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
        <div className="p-3 flex flex-col justify-center">
            <div className="flex flex-col text-sm items-center justify-center">
                <div className="mx-auto mt-2 flex items-center">
                    <User date={new Date(user.createdAt)} large={true} userData={findUserData(user.id)}/>
                </div>
                <hr className="w-full my-3 border-dashed border-neutral-200 dark:border-zinc-800"/>
            </div>
            <div className="flex items-center justify-center p-6">
                <div className="flex flex-col mx-auto">
                    <h2 className="text-2xl text-center">{user.name}'s shares</h2>
                    {user.shares.map((post: any) =>
                        <div key={post.id} className="text-center text-xl p-3 gap-2 flex items-center justify-center flex-col">
                            {post.title}
                            <User post={post} userData={findUserData(post.authorId)} includeLikesAndShares={false} />
                        </div>)}
                </div>
                <div className="flex flex-col mx-auto">
                    <h2 className="text-2xl text-center">{user.name}'s posts</h2>
                    {user.posts.map((post: any) =>
                        <div key={post.id} className="text-center text-xl p-3 gap-2 flex items-center justify-center flex-col">
                            {post.title}
                            <User post={post} userData={findUserData(post.authorId)} includeLikesAndShares={false} />
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
            createdAt:true,
            id:true,
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