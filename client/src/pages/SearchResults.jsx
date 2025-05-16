"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import SearchBar from "../components/SearchBar"

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const { token } = useContext(AuthContext)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchBlogs = async () => {
      if (!query || !token) return

      setLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/api/blogs/search?q=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setResults(data)
        } else {
          toast.error("Failed to search blogs")
        }
      } catch (error) {
        console.error("Error searching blogs:", error)
        toast.error("Failed to search blogs")
      } finally {
        setLoading(false)
      }
    }

    searchBlogs()
  }, [query, token])

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {query && (
            <p className="text-gray-600 mb-4">
              {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
            </p>
          )}

          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No blogs found matching your search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold">
                    <Link to={`/blogs/${blog._id}`} className="hover:text-purple-600">
                      {blog.title || "Untitled"}
                    </Link>
                  </h2>
                  <div className="flex items-center mt-2 space-x-4">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status === "published" ? "Published" : "Draft"}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(blog.updated_at).toLocaleDateString()}</span>
                  </div>
                  {blog.content && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                      {blog.content.length > 150 ? "..." : ""}
                    </p>
                  )}
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {blog.categories.map((category) => (
                        <span key={category._id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchResults
