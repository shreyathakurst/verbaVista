import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

// Update the updated_at field before saving
blogSchema.pre("save", function (next) {
  this.updated_at = Date.now()
  next()
})

const Blog = mongoose.model("Blog", blogSchema)

export default Blog
