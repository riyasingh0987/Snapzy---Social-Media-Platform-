# Social Media Platform

A modern, full-stack social media platform built with MERN stack.

## Features

- User authentication (Register/Login)
- Create posts with text and images
- Like and comment on posts
- Follow/unfollow users
- User profiles
- Search users
- Suggested users
- Responsive design

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Quick Start

1. **Run setup check:**
   ```bash
   ./check-setup.sh
   ```

2. **Set up MongoDB:**
   - **MongoDB Atlas (Easiest):**
     - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
     - Create free account → Create cluster → Get connection string
     - Update `server/.env`: `MONGO_URI=your_atlas_connection_string`
   - **Local MongoDB:**
     ```bash
     brew install mongodb-community
     brew services start mongodb-community
     ```

3. **Start the app:**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

4. **Open:** http://localhost:5174

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

#### Backend (.env)
The `.env` file is already created in the server folder with default values. Update the MongoDB URI if needed:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialmedia
JWT_SECRET=supersecretjwttokenkey123456789
UPLOAD_PATH=uploads/
```

### 3. Database Setup

#### Option 1: MongoDB Atlas (Recommended for Development)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env` in server folder:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmedia
   ```

#### Option 2: Local MongoDB
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Note:** If you encounter Homebrew issues, use MongoDB Atlas for easier setup.

### 4. Start the Application

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
npm run dev
```

The application will be running at:
- Frontend: http://localhost:5174
- Backend: http://localhost:5001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get posts feed
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id/like` - Like/unlike post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:postId` - Get comments for post
- `PUT /api/comments/:id/like` - Like/unlike comment
- `DELETE /api/comments/:id` - Delete comment

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/follow/:id` - Follow/unfollow user
- `GET /api/users/suggested` - Get suggested users

## Project Structure

```
social-media-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/                 # Node.js backend
    ├── config/            # Database config
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── utils/            # Utility functions
    ├── uploads/          # Uploaded files
    ├── server.js
    └── package.json
```

## Features Overview

### Authentication
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### Posts
- Create posts with text and images
- Like/unlike posts
- Comment on posts
- Delete own posts
- Image upload with multer

### User Management
- User profiles with bio and profile picture
- Follow/unfollow system
- Search users by name or username
- Suggested users

### UI/UX
- Modern, responsive design
- Mobile-first approach
- Clean Tailwind CSS styling
- Smooth interactions

## Development

### Adding New Features
1. Backend: Create model → controller → route
2. Frontend: Create component → add to page → update API service
3. Test thoroughly

### Code Style
- Clean, readable code
- Modular components
- Proper error handling
- Consistent naming conventions

## Deployment

### Backend Deployment
1. Set up MongoDB database
2. Update environment variables
3. Deploy to Heroku, Railway, or similar
4. Set up file storage (AWS S3, Cloudinary, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API base URL in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.# Snapzy---Social-Media-Platform-
