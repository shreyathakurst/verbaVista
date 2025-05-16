import jwt from "jsonwebtoken"
import User from "../models/User.js"

const JWT_SECRET = process.env.JWT_SECRET || "secret123"

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user by id
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Set user in request object
    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ message: "Token is not valid" })
  }
}
