import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import Blog from "../models/Blog.js"
import Category from "../models/Category.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.name = name.trim()
    await user.save()

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user account
router.delete("/", authenticate, async (req, res) => {
  try {
    // Delete all user's blogs
    await Blog.deleteMany({ user: req.user._id })

    // Delete all user's categories
    await Category.deleteMany({ user: req.user._id })

    // Delete user
    await User.findByIdAndDelete(req.user._id)

    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
