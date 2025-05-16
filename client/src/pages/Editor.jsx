"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import RichTextEditor from "../components/RichTextEditor"
import CategorySelector from "../components/CategorySelector"

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    tags: "",
    categories: [],
    status: "draft",
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch blog if editing an existing one
  useEffect(() => {
    if (id) {
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
            setBlog({
              title: data.title,
              content: data.content,
              tags: data.tags.join(", "),
              categories: data.categories?.map((cat) => cat._id) || [],
              status: data.status,
            })
          } else {
            toast.error("Failed to load blog")
          }
        } catch (error) {
          console.error("Error fetching blog:", error)
          toast.error("Failed to load blog")
        } finally {
          setLoading(false)
        }
      }

      if (token) {
        fetchBlog()
      }
    }
  }, [id, token])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setBlog((prev) => ({ ...prev, [name]: value }))
  }

  // Handle rich text editor content change
  const handleContentChange = (content) => {
    setBlog((prev) => ({ ...prev, content }))
  }

  // Handle category selection
  const handleCategoryChange = (selectedCategories) => {
    setBlog((prev) => ({ ...prev, categories: selectedCategories }))
  }

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce(async (blogData) => {
      if (!blogData.title && !blogData.content) return

      setSaving(true)
      try {
        const endpoint = id ? `http://localhost:3000/api/blogs/${id}` : "http://localhost:3000/api/blogs/save-draft"

        const method = id ? "PUT" : "POST"

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: blogData.title,
            content: blogData.content,
            tags: blogData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
            categories: blogData.categories,
            status: "draft",
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (!id) {
            // If it's a new blog, update the URL to include the new blog ID
            navigate(`/editor/${data._id}`, { replace: true })
          }
          toast.success("Draft auto-saved")
        } else {
          toast.error("Failed to save draft")
        }
      } catch (error) {
        console.error("Error saving draft:", error)
        toast.error("Failed to save draft")
      } finally {
        setSaving(false)
      }
    }, 5000),
    [id, token, navigate],
  )

  // Trigger auto-save when blog content changes
  useEffect(() => {
    if (token && (blog.title || blog.content)) {
      debouncedSave(blog)
    }

    // Set up auto-save interval (every 30 seconds)
    const intervalId = setInterval(() => {
      if (token && (blog.title || blog.content)) {
        debouncedSave(blog)
      }
    }, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [blog, debouncedSave, token])

  // Save draft manually
  const saveDraft = async () => {
    if (!blog.title && !blog.content) {
      toast.error("Please add a title or content")
      return
    }

    setSaving(true)
    try {
      const endpoint = id ? `http://localhost:3000/api/blogs/${id}` : "http://localhost:3000/api/blogs/save-draft"

      const method = id ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          tags: blog.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          categories: blog.categories,
          status: "draft",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (!id) {
          // If it's a new blog, update the URL to include the new blog ID
          navigate(`/editor/${data._id}`, { replace: true })
        }
        toast.success("Draft saved successfully")
      } else {
        toast.error("Failed to save draft")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    } finally {
      setSaving(false)
    }
  }

  // Publish blog
  const publishBlog = async () => {
    if (!blog.title) {
      toast.error("Please add a title")
      return
    }

    if (!blog.content) {
      toast.error("Please add content")
      return
    }

    setLoading(true)
    try {
      const endpoint = id ? `http://localhost:3000/api/blogs/${id}` : "http://localhost:3000/api/blogs/publish"

      const method = id ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          tags: blog.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          categories: blog.categories,
          status: "published",
        }),
      })

      if (response.ok) {
        toast.success("Blog published successfully")
        navigate("/blogs")
      } else {
        toast.error("Failed to publish blog")
      }
    } catch (error) {
      console.error("Error publishing blog:", error)
      toast.error("Failed to publish blog")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{id ? "Edit Blog" : "Create New Blog"}</h1>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={blog.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter blog title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
          Content
        </label>
        <RichTextEditor
          value={blog.content}
          onChange={handleContentChange}
          placeholder="Write your blog content here..."
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={blog.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="technology, web development, react"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Categories</label>
        <CategorySelector selectedCategories={blog.categories} onChange={handleCategoryChange} />
      </div>

      <div className="flex justify-between items-center">
        <div>{saving && <span className="text-sm text-gray-500 italic">Auto-saving...</span>}</div>
        <div className="flex space-x-4">
          <button
            onClick={saveDraft}
            disabled={loading || saving}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={publishBlog}
            disabled={loading || saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default Editor
