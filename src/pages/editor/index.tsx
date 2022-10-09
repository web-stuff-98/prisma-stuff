import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import IResponseMessage from '../../interfaces/IResponseMessage';

import { useFormik } from 'formik';

import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';

import prisma from '../../lib/prisma';
import { Post } from '@prisma/client';
import { useRouter } from 'next/router';

const Editor = ({ post }: { post: any }) => {
    const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: "", err: false, pen: false })
    const [progress, setProgress] = useState(0)

    const { query } = useRouter()
    const { postId: postEditingId } = query

    useEffect(() => {
        if (post) {
            formik.setFieldValue("title", post.title)
            formik.setFieldValue("description", post.description)
            formik.setFieldValue("tags", "#" + post.tags.map((tag: any) => `${tag.name} `).join("#"))
            formik.setFieldValue("content", post.content)
        }
    }, [post])

    const [base64coverImage, setBase64coverImage] = useState('')
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            content: '',
            tags: '',
        },
        onSubmit: async (values) => {
            try {
                setProgress(0)
                setResMsg({ msg: postEditingId ? "Updating post" : "Creating post", err: false, pen: true })
                if (!base64coverImage && !postEditingId) throw new Error("No cover image selected")
                const axres = await axios({
                    url: postEditingId ? `/api/post?id=${postEditingId}` : "/api/post",
                    method: postEditingId ? 'PATCH' : 'POST',
                    data: postEditingId && base64coverImage ? { ...values, withImage: true } : values
                })
                if (base64coverImage) {
                    const formData = new FormData()
                    formData.append("file", await (await fetch(base64coverImage)).blob())
                    const axiosConfig: AxiosRequestConfig = {
                        onUploadProgress: (progressEvent) => setProgress(Math.round((progressEvent.loaded * 100) / Number(progressEvent.total))),
                        headers: { 'Content-Type': 'multipart/form-data; boundary=XXX', },
                        withCredentials: true,
                    }
                    const url = `/api/post/image?postId=${postEditingId ? postEditingId : axres.data.id}`
                    await axios({ url, data: formData, ...axiosConfig, method: postEditingId ? "PUT" : "POST" })
                }
                setResMsg({ msg: postEditingId ? "Post updated" : "Post created", err: false, pen: false })
            } catch (e: AxiosError | any) {
                if (axios.isAxiosError(e)) {
                    e.response ?
                        //@ts-ignore-error
                        (has(e.response, "data") ? setResMsg({ msg: e.response.data.message, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                        : setResMsg({ msg: `${e}`, pen: false, err: true })
                }
            }
        }
    })

    const getRandomImage = async () => {
        try {
            const axres = await axios({
                method: "GET",
                url: `https://picsum.photos/${Math.random() > 0.5 ? 900 : 600}/${Math.random() > 0.5 ? 900 : 600}`,
                headers: { "Content-type": "image/jpeg" },
                responseType: "arraybuffer"
            })
            const bufferString = Buffer.from(axres.data, "binary").toString("base64")
            const base64 = `data:image/jpeg;base64, ${bufferString}`
            setBase64coverImage(base64)
        } catch (e: AxiosError | any) {
            if (axios.isAxiosError(e)) {
                e.response ?
                    //@ts-ignore-error
                    (has(e.response, "data") ? setResMsg({ msg: e.response.data.message, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                    : setResMsg({ msg: `${e}`, pen: false, err: true })
            }
        }
    }

    return (
        <form className='container p-1 mx-auto gap-2 flex flex-col' onSubmit={formik.handleSubmit}>
            <label className='mx-auto mt-1' htmlFor='title'>Title</label>
            <input
                className='p-1 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                autoFocus
                onChange={formik.handleChange}
                placeholder="Title"
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
            />
            <label className='mx-auto mt-1' htmlFor='description'>Description</label>
            <input
                className='p-1 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                autoFocus
                onChange={formik.handleChange}
                placeholder="Description"
                type="text"
                id="description"
                name="description"
                value={formik.values.description}
            />
            <label className='mx-auto mt-1' htmlFor='tags'>Tags (start each tag with #)</label>
            <input
                className='p-1 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                autoFocus
                onChange={formik.handleChange}
                placeholder="Tags"
                type="text"
                id="tags"
                name="tags"
                value={formik.values.tags}
            />
            <label className='mx-auto mt-1' htmlFor='content'>Content</label>
            <textarea
                className='p-1 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                cols={50}
                onChange={formik.handleChange}
                placeholder="Content"
                id="content"
                name="content"
                rows={8}
                value={formik.values.content}
            />
            {progress}
            {resMsg.msg && resMsg.msg}
            {JSON.stringify(post)}
            <button type="submit">Submit</button>
            <button onClick={() => getRandomImage()} type="button">Random image</button>
            {base64coverImage && <div className='relative rounded mx-auto w-20 h-20'>
                <Image src={base64coverImage} objectPosition="absolute" objectFit="contain" className="m-1 shadow rounded" layout="fill" />
            </div>}
        </form>
    );
};

const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const postId = ctx.query.postId
    //if is editing
    if (postId) {
        try {
            const post = await prisma.post.findUniqueOrThrow({
                where: { id: String(postId) },
                include: { tags: true }
            })
            return {
                props: {
                    post: JSON.parse(JSON.stringify(post))
                }
            }
        } catch (e) {
            return { props: {} }
        }
    }
    return {
        props: {}
    }
}
export { getServerSideProps }

export default Editor;