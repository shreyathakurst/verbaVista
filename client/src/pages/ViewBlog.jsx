"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

const ViewBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBlog(data)
        } else {
          toast.error("Failed to load blog")
          navigate("/blogs")
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
        toast.error("Failed to load blog")
        navigate("/blogs")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchBlog()
    }
  }, [id, token, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Blog not found</p>
        <Link to="/blogs" className="text-purple-600 hover:underline mt-4 inline-block">
          Back to Blogs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span
              className={`text-sm px-2 py-1 rounded ${
                blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {blog.status === "published" ? "Published" : "Draft"}
            </span>
            <span className="text-sm text-gray-500 ml-2">{new Date(blog.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/editor/${blog._id}`}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Edit
            </Link>
            <Link to="/blogs" className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Back
            </Link>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.categories.map((category) => (
              <span key={category._id} className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {category.name}
              </span>
            ))}
          </div>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  )
}

export default ViewBlog
