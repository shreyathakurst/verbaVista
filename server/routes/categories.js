import express from "express"
import Category from "../models/Category.js"
import Blog from "../models/Blog.js" // Import Blog model
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get all categories for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new category
router.post("/", authenticate, async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" })
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      user: req.user._id,
    })

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" })
    }

    const category = new Category({
      name: name.trim(),
      user: req.user._id,
    })

    await category.save()
    res.status(201).json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a category
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" })
    }

    // Find category and check ownership
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if the new name already exists for this user
    if (name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        user: req.user._id,
        _id: { $ne: category._id },
      })

      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" })
      }
    }

    // Update name
    category.name = name.trim()
    await category.save()
    res.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a category
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const result = await Category.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Remove this category from all blogs
    await Blog.updateMany({ user: req.user._id, categories: req.params.id }, { $pull: { categories: req.params.id } })

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
