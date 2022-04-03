import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Posts from '../components/Posts/Posts'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex items-center justify-between border border-y-black bg-yellow-400 py-10 lg:py-0">
        <div className="space-y-5 px-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className=" underline decoration-black decoration-4">
              Medium{' '}
            </span>
            is a place to write, read, and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers
          </h2>
        </div>
        <div>
          <h1 className="hidden text-[20rem] font-extrabold md:inline-flex">
            M
          </h1>
        </div>
      </div>

      <div className="my-10 mx-4 xl:mx-0">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="w-full cursor-pointer transition-transform hover:scale-105 sm:w-1/5">
              <img
                className=" rounded-md"
                src={urlFor(post.mainImage).url()!}
                alt="post-image"
              />
              <h1 className="mt-2 font-serif font-semibold  text-slate-800">
                {post.title}
              </h1>
              <p className="mt-1 h-16 overflow-hidden text-ellipsis text-sm font-semibold leading-5 text-slate-500">
                {post.description}
              </p>
              <p className="mt-2 text-xs font-extrabold text-red-700">
                @{post.author.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
      _id,
      title,
      author->{
        name,
        image
      },
      description,
      mainImage,
      slug
    }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
