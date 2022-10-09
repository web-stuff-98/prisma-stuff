import React from "react"
import { GetServerSidePropsContext } from "next"
import { useSession, getSession } from "next-auth/react"
import prisma from "../lib/prisma"
import Post from "../components/Post"

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
    const session = await getSession({ req })
    if (!session) {
        res.statusCode = 403
        return { props: { drafts: [] } }
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: String(session.user.uid) },
            published: false
        },
        include: {
            author: {
                select: { name: true }
            }
        }
    })

    return {
        props: { drafts }
    }
}


type Props = {
    drafts: any[]
}

const Drafts: React.FC<Props> = (props) => {
    return (
        <div>
            {JSON.stringify(props)}
            {props.drafts.map((post:any) => (<Post post={post}/>))}
        </div>
    )
}

export default Drafts