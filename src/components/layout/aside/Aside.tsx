import Post, { IPost } from "../../Post";

export default function Aside({posts}: {posts:IPost[]}) {
    return (
        <aside className="flex flex-col h-full p-2">
            <h4 className="text-xl py-1 mx-auto">Recommended</h4>
            <div className="gap-2">
                {posts && posts.map((post:IPost) => <Post small={true} post={post}/>)}
            </div>
        </aside>
    )
}