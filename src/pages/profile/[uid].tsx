import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

interface IUserProfile {
    name: string,
    image: string,
    shares: string[]
}

export default function Profile({ user }: { user: IUserProfile }) {
    return (
        <div className="container mx-auto flex flex-col justify-center">
            <h1 className="text-3xl">{user.name}</h1>
            <hr/>
            <div>
                <h2 className="text-xl">{user.name}'s shares</h2>
                {user.shares.map((postId: string) => `${postId}`)}
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
            shares: true
        }
    })
    let user: any = q
    user.shares = q?.shares.map((share: any) => share.postId)
    return {
        props: { user: JSON.parse(JSON.stringify(user)) },
    };
};