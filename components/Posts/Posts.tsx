import Link from 'next/link'
import { sanityClient } from '../../sanity'
import { Post } from '../../typings'

function Posts() {
  return (
    <div>
      {/* {posts.map((post) => (
        <Link key={post._id} href={`/post/${post.slug}`}>
          <div>
            <h1>{post.title}</h1>
          </div>
        </Link>
      ))} */}
    </div>
  )
}

export default Posts
