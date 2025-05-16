
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import SearchBar from "./SearchBar"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-purple-700">
            verbaVista
          </Link>

          <div className="hidden md:block mx-4 flex-grow max-w-md">{user && <SearchBar onSearch={handleSearch} />}</div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/blogs" className="text-gray-700 hover:text-purple-600">
                  My Blogs
                </Link>
                <Link to="/editor" className="text-gray-700 hover:text-purple-600">
                  New Blog
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-purple-600 focus:outline-none">
                    <span className="mr-1">{user.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600">
                  Login
                </Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            {user && (
              <div className="mb-4">
                <SearchBar onSearch={handleSearch} />
              </div>
            )}
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link
                    to="/blogs"
                    className="text-gray-700 hover:text-purple-600 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    My Blogs
                  </Link>
                  <Link
                    to="/editor"
                    className="text-gray-700 hover:text-purple-600 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    New Blog
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-purple-600 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowMobileMenu(false)
                    }}
                    className="text-left text-gray-700 hover:text-purple-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purple-600 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
