import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import blogRoutes from "./routes/blogs.js"
import categoryRoutes from "./routes/categories.js"
import userRoutes from "./routes/users.js"
import uploadRoutes from "./routes/upload.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://siuthakur2003:JjsQ1tfsnQDHcgc0@cluster0.arqrvgo.mongodb.net/verba-vista"

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/users", userRoutes)
app.use("/api/upload", uploadRoutes)

// Health check route
app.get("/", (req, res) => {
  res.send("verbaVista API is running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
