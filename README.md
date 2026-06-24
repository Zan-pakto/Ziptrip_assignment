# Todo Application

A simple and clean Todo application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- View all todos in a list
- Add a new todo (title and optional description)
- Edit existing todos
- Delete todos
- Mark todos as completed/pending
- View details of a single todo on a separate page
- Responsive and clean UI using Tailwind CSS

## Technologies Used
**Frontend:**
- React (Vite)
- React Router (for navigation)
- Tailwind CSS (for styling)
- Axios (for API requests)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- CORS & dotenv

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally (default URL: `mongodb://127.0.0.1:27017/todoapp`)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd <repository-directory>
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev # or node index.js
\`\`\`
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The React application will run on `http://localhost:5173` (or port specified by Vite).

## API Documentation

**Base URL:** `http://localhost:5000/api/todos`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Get all todos | None |
| GET | `/:id` | Get single todo by ID | None |
| POST | `/` | Create a new todo | `{ title: String, description: String (optional) }` |
| PUT | `/:id` | Update an existing todo | `{ title, description, completed }` |
| DELETE | `/:id` | Delete a todo | None |

## Database Schema (Todo)
- `title` (String, required)
- `description` (String, optional)
- `completed` (Boolean, default: false)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)
