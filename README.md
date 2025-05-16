# verbaVista Blog Editor

A full-stack blog editor application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Write and edit blog posts with a rich text editor
- Auto-save drafts while typing
- Upload and embed images in blog posts
- Categorize blogs with tags and categories
- Search functionality for finding blogs
- User profile management
- JWT authentication

## Tech Stack

### Frontend
- React (Vite + JavaScript)
- Tailwind CSS
- React Router DOM
- React Hot Toast
- TinyMCE for rich text editing

### Backend
- Node.js + Express.js
- MongoDB Atlas
- JWT Authentication
- Multer for file uploads

## Project Structure

\`\`\`
verbaVista/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # Reusable components
│   │   │   ├── CategorySelector.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── context/        # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── BlogManagement.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── ViewBlog.jsx
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend Express application
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # MongoDB models
│   │   ├── Blog.js         # Blog model
│   │   ├── Category.js     # Category model
│   │   └── User.js         # User model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── blogs.js        # Blog routes
│   │   ├── categories.js   # Category routes
│   │   ├── upload.js       # File upload routes
│   │   └── users.js        # User routes
│   ├── uploads/            # Uploaded files directory
│   ├── server.js           # Server entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
│
└── README.md               # Project documentation
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/verbaVista.git
cd verbaVista
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd ../client
npm install
\`\`\`

4. Create a `.env` file in the server directory with the following variables:
\`\`\`
PORT=3000
MONGODB_URI=mongodb+srv://siuthakur2003:JjsQ1tfsnQDHcgc0@cluster0.arqrvgo.mongodb.net/verba-vista
JWT_SECRET=secret123
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
cd server
npm run dev
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd client
npm run dev
\`\`\`

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login a user |
| GET | /api/auth/verify | Verify JWT token |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/blogs | Get all blogs for the authenticated user |
| GET | /api/blogs/search | Search blogs by query |
| GET | /api/blogs/:id | Get a single blog by ID |
| POST | /api/blogs/save-draft | Create/update a draft blog |
| POST | /api/blogs/publish | Publish a blog |
| PUT | /api/blogs/:id | Update a blog |
| DELETE | /api/blogs/:id | Delete a blog |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories for the authenticated user |
| POST | /api/categories | Create a new category |
| PUT | /api/categories/:id | Update a category |
| DELETE | /api/categories/:id | Delete a category |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get user profile |
| PUT | /api/users/profile | Update user profile |
| PUT | /api/users/change-password | Change user password |
| DELETE | /api/users | Delete user account |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload an image |

## Dependencies

### Frontend Dependencies
- react
- react-dom
- react-router-dom
- react-hot-toast
- @tinymce/tinymce-react
- tailwindcss
- @tailwindcss/typography
- @tailwindcss/line-clamp

### Backend Dependencies
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- multer
