"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  useEffect(() => {
    // Check if user is logged in
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            // Token is invalid
            localStorage.removeItem("token")
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error("Error verifying token:", error)
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    verifyToken()
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>
}
