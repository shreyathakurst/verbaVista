import express from "express"
import Blog from "../models/Blog.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get all blogs for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).populate("categories").sort({ updated_at: -1 })
    res.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Search blogs
router.get("/search", authenticate, async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const searchRegex = new RegExp(q, "i")

    const blogs = await Blog.find({
      user: req.user._id,
      $or: [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }],
    })
      .populate("categories")
      .sort({ updated_at: -1 })

    res.json(blogs)
  } catch (error) {
    console.error("Error searching blogs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single blog by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("categories")

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Save a draft blog
router.post("/save-draft", authenticate, async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body

    const blog = new Blog({
      title,
      content,
      tags,
      categories,
      status: "draft",
      user: req.user._id,
    })

    await blog.save()

    const populatedBlog = await Blog.findById(blog._id).populate("categories")
    res.status(201).json(populatedBlog)
  } catch (error) {
    console.error("Error saving draft:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Publish a blog
router.post("/publish", authenticate, async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body

    if (!title) {
      return res.status(400).json({ message: "Title is required" })
    }

    const blog = new Blog({
      title,
      content,
      tags,
      categories,
      status: "published",
      user: req.user._id,
    })

    await blog.save()

    const populatedBlog = await Blog.findById(blog._id).populate("categories")
    res.status(201).json(populatedBlog)
  } catch (error) {
    console.error("Error publishing blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a blog
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, content, tags, categories, status } = req.body

    // Find blog and check ownership
    const blog = await Blog.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Update fields
    blog.title = title
    blog.content = content
    blog.tags = tags
    blog.categories = categories

    if (status) {
      blog.status = status
    }

    blog.updated_at = Date.now()

    await blog.save()

    const populatedBlog = await Blog.findById(blog._id).populate("categories")
    res.json(populatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a blog
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const result = await Blog.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
