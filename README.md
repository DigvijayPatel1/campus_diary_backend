# Campus Voice 🎓

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://www.campusvoice.in)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2.1-yellow?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

> **Campus Voice** is a comprehensive social and professional networking platform exclusively designed for **National Institute of Technology (NITC)** students and alumni. Share experiences, explore career opportunities, and connect with peers through an interactive campus community.

**Live URL:** [www.campusvoice.in](https://www.campusvoice.in)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Email Service](#email-service)
- [File Upload & Storage](#file-upload--storage)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Contact & Support](#contact--support)
- [License](#license)

---

## 🎯 Overview

Campus Voice is a full-stack application that bridges the gap between NITC students, fostering knowledge sharing and career development. The platform enables users to:

- **Create and share professional experiences** - Post interview experiences with detailed round-by-round feedback
- **Build professional profiles** - Showcase skills, achievements, and career aspirations
- **Engage with content** - Comment on posts, like content, and interact with peers
- **Discover opportunities** - Learn from alumni about internships, placements, and career paths
- **Network securely** - Connect exclusively with NITC community members (verified via @nitc.ac.in email)

This repository contains the **Node.js/Express backend API** built with RESTful principles and optimized for performance and scalability.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Email-based authentication** with NITC domain verification (@nitc.ac.in)
- **JWT-based token system** with refresh token support
- **Email verification** with time-limited verification tokens
- **Password reset functionality** with secure token generation
- **Role-based access control** (User, Admin roles)
- **Secure password hashing** with bcrypt

### 👤 User Management
- **Comprehensive user profiles** with personal and professional details
- **Branch selection** (CSE, ECE, Electrical, Mechanical, Civil, Chemical, Metallurgy, Biotech, Production, Architecture)
- **Avatar selection** from predefined collection (a1-a10)
- **Social media links** integration (LinkedIn, GitHub, Twitter)
- **Profile visibility control** - Private/Public profiles
- **User search and filtering** capabilities

### 📝 Content Management
- **Tweet/Blog posting** with rich text support
- **Interview experience sharing** with detailed round information
- **Comment functionality** - Thread-based discussions
- **Like system** - React to content with likes
- **Developer profiles** - Portfolio and professional showcase

### 💼 Interview Experience Module
- **Company-wise experience sharing** - Post interview feedback for specific companies
- **Round-wise documentation** - Explain each round (Online, Technical, HR, etc.)
- **Type classification** - Differentiate between Full-time and Internship positions
- **Domain categorization** - Organize by Tech, Core, Management, Finance, Consulting
- **Offer tracking** - Document offers and feedback
- **Filterable search** - Find experiences by company, role, domain, or branch

### 🖼️ Media Management
- **Cloudinary integration** for image optimization and storage
- **Avatar management** - Upload and manage profile pictures
- **File upload handling** with multer middleware

### 📧 Email Notifications
- **Verification emails** for new accounts
- **Password reset emails** with secure links
- **Welcome emails** with personalized content
- **HTML-based email templates** for professional appearance

### ⚙️ Admin Features
- **Admin dashboard access** for platform management
- **User moderation** capabilities
- **Content management** and removal
- **Platform analytics** (future enhancement)

---

## 🛠️ Tech Stack

### Backend Framework & Runtime
- **Node.js** - JavaScript runtime
- **Express.js (v5.2.1)** - Fast, unopinionated web framework
- **ES6 Modules** - Modern JavaScript syntax

### Database
- **MongoDB** - NoSQL database for flexible schema
- **Mongoose (v9.1.2)** - ODM (Object Data Modeling) for MongoDB

### Authentication & Security
- **jsonwebtoken (JWT)** - Token-based authentication
- **bcrypt (v6.0.0)** - Password hashing and verification
- **cookie-parser** - Cookie parsing middleware

### File & Image Management
- **Multer (v2.0.2)** - Middleware for file uploads
- **Cloudinary (v2.8.0)** - Cloud-based image storage and optimization

### Email Service
- **Nodemailer (v7.0.12)** - Email delivery service
- **Gmail SMTP** - Email service provider

### API & Middleware
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **express-json** - JSON parsing middleware
- **express-urlencoded** - URL-encoded data parsing

### Development Tools
- **Nodemon (v3.1.11)** - Auto-restart development server
- **Prettier (v3.7.4)** - Code formatting
- **Vercel** - Deployment and hosting platform

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or MongoDB Atlas cloud)
- **Cloudinary** account for image hosting
- **Gmail account** with App Password for email service
- **Git** for version control
- **Vercel account** (for deployment)
- **NITC email domain** (for testing user authentication)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DigvijayPatel1/campus_diary_backend.git
cd campus-voice-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# CORS & Security
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=Nitc_Connect

# JWT Tokens
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Password Reset Token
PASSWORD_RESET_TOKEN_EXPIRY=15m

# Email Verification
EMAIL_VERIFICATION_TOKEN_EXPIRY=24h
```

### 4. Configure MongoDB

**Option A - MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and obtain connection string
3. Add your IP to whitelist
4. Update `MONGODB_URI` in `.env`

**Option B - Local MongoDB:**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

### 5. Setup Cloudinary

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from dashboard
3. Add credentials to `.env`

### 6. Gmail App Password Setup

1. Enable 2-step verification on Gmail account
2. Generate App Password (not regular password)
3. Copy and paste in `EMAIL_PASS` in `.env`

### 7. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:8000`

---

## 📁 Project Structure

```
campus-voice-backend/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── index.js                        # Server entry point & Vercel handler
│   ├── constant.js                     # App constants & enums
│   │
│   ├── controllers/                    # Business logic layer
│   │   ├── user.controller.js         # User authentication & management
│   │   ├── tweet.controller.js        # Tweet/blog operations
│   │   ├── interview.controller.js    # Interview experience management
│   │   ├── comment.controller.js      # Comment operations
│   │   ├── like.controller.js         # Like functionality
│   │   └── developer.controller.js    # Developer profile management
│   │
│   ├── models/                         # Database schemas
│   │   ├── user.model.js              # User schema with auth fields
│   │   ├── tweet.model.js             # Tweet schema
│   │   ├── interview.model.js         # Interview experience schema
│   │   ├── comment.model.js           # Comment schema
│   │   ├── like.model.js              # Like interactions schema
│   │   └── developer.model.js         # Developer profile schema
│   │
│   ├── routes/                         # API endpoint definitions
│   │   ├── user.route.js              # /api/v1/users
│   │   ├── tweet.route.js             # /api/v1/tweets
│   │   ├── interview.route.js         # /api/v1/interviews
│   │   ├── comment.route.js           # /api/v1/comments
│   │   ├── like.route.js              # /api/v1/likes
│   │   ├── developer.route.js         # /api/v1/developers
│   │   └── test.route.js              # /api/v1/test
│   │
│   ├── middlewares/                    # Custom middleware functions
│   │   ├── auth.middleware.js         # JWT verification & auth checks
│   │   ├── admin.middleware.js        # Admin role verification
│   │   ├── error.middleware.js        # Centralized error handling
│   │   └── multer.middleware.js       # File upload configuration
│   │
│   ├── db/
│   │   └── index.js                   # MongoDB connection setup
│   │
│   └── utils/                          # Utility functions & helpers
│       ├── ApiError.js                # Custom error class
│       ├── ApiResponse.js             # Standardized response format
│       ├── asyncHandler.js            # Async error wrapper
│       ├── cloudinary.js              # Cloudinary integration
│       ├── sendEmail.js               # Email sending utility
│       └── emailTemplates.js          # HTML email templates
│
├── public/                             # Static files & temp storage
│   └── temp/                          # Temporary file storage
│
├── package.json                        # Dependencies & scripts
├── vercel.json                         # Vercel deployment config
├── .env.example                        # Environment variable template
└── README.md                           # This file
```

---

## 🔌 API Endpoints

### Base URL
```
Production: https://www.campusvoice.in/api/v1
Development: http://localhost:8000/api/v1
```

### Authentication Endpoints (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user with NITC email | ❌ |
| POST | `/login` | Login and get JWT tokens | ❌ |
| POST | `/verify-email` | Verify email with token | ❌ |
| POST | `/logout` | Logout and clear tokens | ✅ |
| POST | `/refresh-token` | Get new access token | ✅ |
| POST | `/forgot-password` | Request password reset | ❌ |
| POST | `/reset-password/:token` | Reset password with token | ❌ |
| GET | `/profile` | Get current user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |
| DELETE | `/profile` | Delete user account | ✅ |

### Tweet/Blog Endpoints (`/tweets`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new tweet |
| GET | `/` | Get all tweets (paginated) |
| GET | `/:tweetId` | Get specific tweet |
| PUT | `/:tweetId` | Update tweet |
| DELETE | `/:tweetId` | Delete tweet |
| GET | `/user/:userId` | Get tweets by user |

### Interview Experience Endpoints (`/interviews`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create interview experience |
| GET | `/` | Get all interviews (with filters) |
| GET | `/:interviewId` | Get specific interview |
| PUT | `/:interviewId` | Update interview |
| DELETE | `/:interviewId` | Delete interview |
| GET | `/company/:company` | Get interviews by company |
| GET | `/domain/:domain` | Get interviews by domain |
| GET | `/branch/:branch` | Get interviews by branch |

### Comment Endpoints (`/comments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Add comment to post |
| GET | `/:postId` | Get comments for post |
| PUT | `/:commentId` | Edit comment |
| DELETE | `/:commentId` | Delete comment |

### Like Endpoints (`/likes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Like a post |
| DELETE | `/:likeId` | Unlike a post |
| GET | `/:postId` | Get likes for post |

### Developer Profile Endpoints (`/developers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:userId` | Get developer profile |
| PUT | `/:userId` | Update developer profile |
| POST | `/:userId/skills` | Add skills |
| DELETE | `/:userId/skills/:skillId` | Remove skill |

---

## 📊 Database Schema

### User Model

```javascript
{
  // Authentication
  email: String (required, unique, @nitc.ac.in),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"]),
  
  // Email Verification
  isVerified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpires: Date,
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Personal Info
  name: String (required),
  branch: String (required, enum: divisions),
  batch: String (required),
  avatar: String (enum: a1-a10),
  
  // Social Links
  linkedIn: String (URL),
  github: String (URL),
  twitter: String (URL),
  
  // Tokens
  refreshToken: String,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

### Tweet Model

```javascript
{
  author: ObjectId (ref: User, required),
  content: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Interview Experience Model

```javascript
{
  author: ObjectId (ref: User, required),
  company: String (required, indexed),
  role: String (required),
  type: String (enum: ["Full Time", "Internship"]),
  branch: String (required),
  domain: String (enum: ["Tech", "Core", "Management", "Finance", "Consulting"]),
  interviewDate: Date,
  rounds: [{
    title: String,
    description: String
  }],
  hrRound: String,
  offerDetails: String,
  salary: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  author: ObjectId (ref: User, required),
  post: ObjectId (ref: Tweet, required),
  content: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Like Model

```javascript
{
  user: ObjectId (ref: User, required),
  post: ObjectId (ref: Tweet, required),
  createdAt: Date
}
```

---

## 🔐 Authentication

### JWT Token Strategy

**Access Token:**
- Expiry: 15 minutes
- Purpose: API request authentication
- Storage: HTTP-only cookie or Authorization header

**Refresh Token:**
- Expiry: 7 days
- Purpose: Obtain new access token
- Storage: HTTP-only cookie

### Token Usage

```javascript
// Request Header
Authorization: Bearer <access_token>

// OR Cookie
Cookie: accessToken=<access_token>; refreshToken=<refresh_token>
```

### Protected Routes

All routes requiring authentication need valid JWT. Use auth middleware:

```javascript
import { auth } from "./middlewares/auth.middleware.js"

router.get("/profile", auth, userController.getProfile)
```

---

## 📧 Email Service

### Configuration

```javascript
// Using Nodemailer with Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // App-specific password
    }
});
```

### Email Templates

1. **Verification Email** - Account creation verification
2. **Welcome Email** - First-time login greeting
3. **Password Reset** - Password recovery link
4. **Interview Posted** - Notification about new interview experience
5. **Comment Notification** - Alert on new comments

### Sending Email

```javascript
import { sendEmail } from "./utils/sendEmail.js"

await sendEmail(
  recipient@nitc.ac.in,
  "Subject Line",
  "<html>content</html>"
)
```

---

## 🖼️ File Upload & Storage

### Multer Configuration

- **Upload directory:** `public/temp/`
- **File size limit:** 16KB (configured in express)
- **Allowed formats:** JPEG, PNG, GIF, WebP (Cloudinary validated)

### Cloudinary Integration

```javascript
// Upload to Cloudinary
const result = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto",
    folder: "campusvoice"
})

// Delete from Cloudinary
await cloudinary.uploader.destroy(publicId)
```

---

## ⚠️ Error Handling

### Custom API Error Class

```javascript
import { ApiError } from "./utils/ApiError.js"

throw new ApiError(
  statusCode,
  message,
  errors,  // optional detailed errors
  stack
)
```

### Standard Error Response

```javascript
{
  success: false,
  statusCode: 400,
  message: "Error message",
  errors: [],
  stack: "Error stack trace (dev only)"
}
```

### Centralized Error Middleware

```javascript
// Catches all errors and formats response
app.use(errorMiddleware)
```

---

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel with Serverless Functions.

**Configuration:** `vercel.json`

```json
{
  "version": 2,
  "builds": [{
    "src": "src/index.js",
    "use": "@vercel/node"
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "src/index.js"
  }]
}
```

### Deployment Steps

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add EMAIL_USER
   # ... add all environment variables
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Custom Domain:**
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add custom domain `campusvoice.in`
   - Configure DNS records

---

## 👨‍💻 Development Guidelines

### Code Style

- **Format with Prettier:** `npm run format` (configure as needed)
- **Use ES6+ syntax:** Arrow functions, async/await, destructuring
- **Naming conventions:**
  - Constants: `UPPER_SNAKE_CASE`
  - Functions/Variables: `camelCase`
  - Classes: `PascalCase`
  - Files: `kebab-case.js` or `camelCase.js`

### Async Error Handling

Wrap async route handlers with asyncHandler:

```javascript
import { asyncHandler } from "../utils/asyncHandler.js"

const myController = asyncHandler(async (req, res) => {
    // No need for try-catch
    const data = await someAsyncOperation()
    return res.json(data)
})
```

### Response Format

Use ApiResponse utility for consistency:

```javascript
import { ApiResponse } from "../utils/ApiResponse.js"

res
  .status(200)
  .json(new ApiResponse(200, data, "Success message"))
```

### Validation

Implement input validation before processing:

```javascript
// Validate email format
if (!email.match(/@nitc\.ac\.in$/)) {
    throw new ApiError(400, "Only NITC emails allowed")
}
```

### Database Indexing

Frequently searched fields are indexed:

```javascript
email: { unique: true, index: true }
company: { index: true }  // In interview schema
```

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork** the repository: [github.com/DigvijayPatel1/campus_diary_backend](https://github.com/DigvijayPatel1/campus_diary_backend)
2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes** with meaningful commits
4. **Follow code style** guidelines
5. **Test thoroughly** before submitting
6. **Push to branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request** with detailed description

### Contribution Areas

- 🐛 Bug fixes and issue resolution
- ✨ New features and enhancements
- 📚 Documentation improvements
- ⚡ Performance optimization
- 🔒 Security improvements
- 🧪 Test coverage

---

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**

```
Error: connect ECONNREFUSED
```

**Solution:**
- Verify MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Ensure IP is whitelisted (MongoDB Atlas)

**Email Sending Failed**

```
Error: Invalid login: 535-5.7.8 Username and password not accepted
```

**Solution:**
- Use App Password, not regular Gmail password
- Enable 2-step verification
- Check `EMAIL_USER` and `EMAIL_PASS`

**CORS Error**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Update `CORS_ORIGIN` in `.env` to frontend URL
- Ensure credentials: true is set

**Cloudinary Upload Error**

```
Invalid API Key/Secret
```

**Solution:**
- Verify credentials from Cloudinary dashboard
- Check environment variables
- Ensure account is active

**Vercel Deployment Failed**

**Solution:**
- Check build logs on Vercel dashboard
- Verify all environment variables are set
- Ensure `vercel.json` is correct

### Debug Mode

Enable detailed logging:

```javascript
// In your controller
console.log("[DEBUG]", "Message", data)
```

Check Vercel logs:

```bash
vercel logs --prod
```

---

## 📞 Contact & Support

**Project Maintainers:**
- **Digvijay Patel** - [LinkedIn](https://linkedin.com/in/digvijay-patel)
- **Deepak Yadav** - [LinkedIn](https://linkedin.com/in/deepak-yadav)

**For Issues & Support:**
- � GitHub Issues: [Create an Issue](https://github.com/DigvijayPatel1/campus_diary_backend/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/DigvijayPatel1/campus_diary_backend/discussions)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

Campus Voice © 2024-2025. All rights reserved.

---

## 🙏 Acknowledgments

- **NITC Community** - For inspiration and support
- **Open Source Community** - For amazing libraries and tools
- **Contributors** - For making this platform better

---

## 📈 Roadmap

### Upcoming Features

- [ ] Real-time notifications with WebSocket
- [ ] Alumni mentorship program
- [ ] AI-powered interview insights
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

---

## 🔐 Security

### Best Practices Implemented

✅ HTTPS/TLS encryption
✅ CORS policy enforcement
✅ JWT token-based authentication
✅ Password hashing with bcrypt
✅ SQL injection prevention (MongoDB)
✅ XSS protection
✅ CSRF token validation
✅ Rate limiting (recommended for production)
✅ Environment variable protection
✅ Secure HTTP headers

### Responsible Disclosure

If you discover a security vulnerability, please create a private security issue on GitHub instead of creating a public issue.

---

**Made with ❤️ for the NITC Community**

Last Updated: March 2025
