import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns'
import { RotateLoading } from '../components/Loading'
import { getBlog } from '../lib/api'
import { FaHeart, FaComment } from 'react-icons/fa'
import type { IPost } from '../vite-env';
import { ProfilePicUrl } from '../lib/static';

const Blog = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState<IPost>()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getBlog(id)
      .then(res => setBlog(res.data.data))
      .catch(e => setError('Unable to load blog.' + e))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-96"><RotateLoading /></div>
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>
  if (!blog) return null

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      {blog.featuredImg && (
        <img
          src={blog.featuredImg}
          alt="Featured"
          className="w-full h-full rounded-md mb-6"
        />
      )}
      <header className="mb-4">
        <h1 className="text-4xl font-bold leading-tight mb-2">{blog.title}</h1>
        <div className="flex items-center text-gray-500 text-sm">
          <Link to={`/profile/${blog.user.username}`}>
            <img
              src={blog?.user?.profilePic || ProfilePicUrl}
              alt={blog.user.name}
              className="w-14 h-14 object-cover rounded-full mr-2"
            />
          </Link>
          <span>By <strong>{blog.user.name}</strong> (@{blog.user.username})</span>
          <span className="mx-2">•</span>
          <time dateTime={blog.createdAt}>
            {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
          </time>
        </div>
      </header>

      <section className="prose prose-lg mb-6">
        <p>{blog.content}</p>
      </section>

      <footer className="flex items-center justify-between text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaHeart className="mr-1 text-red-500" />
            <span>{blog._count.likes}</span>
          </div>
          <div className="flex items-center">
            <FaComment className="mr-1" />
            <span>{blog._count.comments}</span>
          </div>
        </div>
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </footer>
    </article>
  )
}

export default Blog
