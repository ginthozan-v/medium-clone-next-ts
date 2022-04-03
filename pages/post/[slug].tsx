import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <Header />

      <article className=" mx-auto my-10 max-w-3xl">
        <img
          className="h-96 w-full object-cover"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />{' '}
        <h1 className="mt-10 mb-3 text-3xl font-bold">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="user-profile"
          />
          <p className=" text-sm font-extralight">
            Blog post by {post.author.name} - Published at{' '}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="prose prose-red my-10 max-w-none md:prose-lg lg:prose-xl">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border-yellow-500" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-10 mx-auto flex max-w-2xl flex-col p-5"
        action=""
      >
        <h3 className="text-yello-500 text-sm">Enjoyed this article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />

        <input {...register('_id')} type="hidden" name="_id" value={post._id} />

        <label className="mb-5 block ">
          <span className="text-gray-700 ">Name</span>
          <input
            {...register('name', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring ring-yellow-500 focus:outline-none"
            type="text"
            name="name"
            id="name"
            placeholder="John Wick"
          />
        </label>
        <label className="mb-5 block ">
          <span className="text-gray-700 ">Email</span>
          <input
            {...register('email', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring ring-yellow-500 focus:outline-none"
            type="email"
            name="email"
            id="email"
            placeholder="john@gmail.com"
          />
        </label>
        <label className="mb-5 block ">
          <span className="text-gray-700 ">comment</span>
          <textarea
            {...register('comment', { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow ring ring-yellow-500 focus:outline-none"
            rows={8}
            placeholder="type comment..."
          />
        </label>

        <div>
          {(errors.name || errors.email || errors.comment) && (
            <p className="text-red-500">Field Required!</p>
          )}
        </div>

        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        />
      </form>
    </div>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug{
        current
    }
}`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author->{
        name,
        image
    },
    'comments': *[
        _type == "comment" && 
        post._ref == ^._id && 
        approved == true],
    description,
    mainImage,
    slug,
    body
}`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
