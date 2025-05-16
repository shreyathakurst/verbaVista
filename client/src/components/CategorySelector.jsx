"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

const CategorySelector = ({ selectedCategories = [], onChange }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return

      try {
        const response = await fetch("http://localhost:3000/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          console.error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [token])

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    onChange(updatedCategories)
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      const response = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([...categories, data])
        setNewCategory("")
        setShowAddForm(false)
        toast.success("Category added successfully")
      } else {
        toast.error("Failed to add category")
      }
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category")
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading categories...</div>
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {categories.map((category) => (
          <label key={category._id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category._id)}
              onChange={() => handleCategoryChange(category._id)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span>{category.name}</span>
          </label>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddCategory} className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
          />
          <button
            type="submit"
            className="px-2 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="text-sm text-purple-600 hover:text-purple-800 focus:outline-none"
        >
          + Add new category
        </button>
      )}
    </div>
  )
}

export default CategorySelector
