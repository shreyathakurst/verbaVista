"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import SearchBar from "../components/SearchBar"

const BlogManagement = () => {
  const { token } = useContext(AuthContext)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all") // 'all', 'published', 'draft'
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!token) return

      setLoading(true)
      try {
        const response = await fetch("http://localhost:3000/api/blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBlogs(data)
        } else {
          toast.error("Failed to fetch blogs")
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
        toast.error("Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [token])

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setBlogs(blogs.filter((blog) => blog._id !== id))
          if (searchResults) {
            setSearchResults(searchResults.filter((blog) => blog._id !== id))
          }
          toast.success("Blog deleted successfully")
        } else {
          toast.error("Failed to delete blog")
        }
      } catch (error) {
        console.error("Error deleting blog:", error)
        toast.error("Failed to delete blog")
      }
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/blogs/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        toast.error("Failed to search blogs")
      }
    } catch (error) {
      console.error("Error searching blogs:", error)
      toast.error("Failed to search blogs")
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
  }

  const displayedBlogs =
    searchResults ||
    blogs.filter((blog) => {
      if (activeTab === "all") return true
      return blog.status === activeTab
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar onSearch={handleSearch} />
          <Link to="/editor" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center">
            Create New Blog
          </Link>
        </div>
      </div>

      {searchResults && (
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
          </p>
          <button onClick={clearSearch} className="text-sm text-purple-600 hover:text-purple-800 focus:outline-none">
            Clear search
          </button>
        </div>
      )}

      {!searchResults && (
        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "all"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "published"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "draft"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("draft")}
            >
              Drafts
            </button>
          </div>
        </div>
      )}

      {displayedBlogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No blogs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  <Link to={`/blogs/${blog._id}`} className="hover:text-purple-600">
                    {blog.title || "Untitled"}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm text-gray-500">{new Date(blog.updated_at).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.categories.map((category) => (
                        <span key={category._id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {blog.content && (
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {blog.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                    {blog.content.length > 100 ? "..." : ""}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/editor/${blog._id}`}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogManagement
