import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent } from "react"
import IResponseMessage from '../../interfaces/IResponseMessage';

import { useFormik } from 'formik';

import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';

import prisma from '../../lib/prisma';
import { useRouter } from 'next/router';
import ProgressBar from '../../components/progressBar/ProgressBar';

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
                    data: postEditingId && base64coverImage ? { ...values, withImage: true, base64coverImage } : { ...values, base64coverImage }
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
                e.response ?
                    //@ts-ignore-error
                    (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                    : setResMsg({ msg: `${e}`, pen: false, err: true })
            }
        }
    })

    const getRandomImage = async () => {
        try {
            const axres = await axios({
                method: "GET",
                url: `https://picsum.photos/1200/600`,
                headers: { "Content-type": "image/jpeg" },
                responseType: "arraybuffer"
            })
            const bufferString = Buffer.from(axres.data, "binary").toString("base64")
            const base64 = `data:image/jpeg;base64, ${bufferString}`
            setBase64coverImage(base64)
        } catch (e: AxiosError | any) {
            e.response ?
                //@ts-ignore-error
                (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                : setResMsg({ msg: `${e}`, pen: false, err: true })
        }
    }

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore-error
        if (!e.target.files[0]) return
        //@ts-ignore-error
        const file: File = e.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onloadend = () => setBase64coverImage(String(fr.result))
    }


    const hiddenFileInputRef = useRef<HTMLInputElement>(null)
    return (
        <form className='container p-1 pt-4 mx-auto gap-2 flex flex-col' onSubmit={formik.handleSubmit}>
            <label className='mx-auto mt-1' htmlFor='title'>Title</label>
            <input
                className='p-1 dark:bg-transparent dark:border-zinc-700 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
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
                className='p-1 dark:bg-transparent dark:border-zinc-700 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
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
                className='p-1 dark:bg-transparent dark:border-zinc-700 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
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
                className='p-1 dark:bg-transparent dark:border-zinc-700 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                cols={50}
                onChange={formik.handleChange}
                placeholder="Content"
                id="content"
                name="content"
                rows={8}
                value={formik.values.content}
            />
            {resMsg.msg && resMsg.msg}
            {resMsg.pen && <ProgressBar percent={progress} />}
            <input onChange={handleFileInput} type="file" ref={hiddenFileInputRef} style={{ display: "none" }} accept=".jpg,.jpeg,.png" />
            <button type="submit" className='bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow rounded-sm border'>Submit</button>
            <button onClick={() => hiddenFileInputRef.current?.click()} type="button" className='bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow rounded-sm border'>Select image</button>
            <button onClick={() => getRandomImage()} type="button" className='bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow rounded-sm border'>Random image</button>
            {base64coverImage && <div className='relative rounded mx-auto w-96 h-48'>
                <Image src={base64coverImage} objectPosition="absolute" objectFit="contain" className="m-1 shadow-lg rounded" layout="fill" />
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