# SafetyHub - Local Deployment Guide

## Project Overview
SafetyHub is a Next.js + MongoDB-based Student Safety & Complaint Management System with role-based access control (Student, Teacher, Admin, Principal).

---

## Prerequisites

Before deploying, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## Step-by-Step Deployment Instructions

### Step 1: Install MongoDB (Local Setup)

**Option A: Local MongoDB Installation**
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Follow the installation guide for your OS
3. Start MongoDB service:
   - **Windows**: MongoDB should start automatically or use `mongod` command
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGO_URL` in `.env.local` with your connection string

**Verify MongoDB is running:**
```bash
mongosh
# or
mongo
```

---

### Step 2: Install Project Dependencies

Navigate to the project directory and install all dependencies:

```bash
# Using npm
npm install

# OR using yarn (if you prefer)
yarn install
```

This will install all packages listed in `package.json` including:
- Next.js 14.2.3
- React 18
- MongoDB driver
- Authentication libraries (bcryptjs, jsonwebtoken)
- UI components (shadcn/ui, Radix UI)
- Tailwind CSS

---

### Step 3: Configure Environment Variables

The `.env.local` file has been created with default values. Update it if needed:

```bash
# .env.local file contents:
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**Important Notes:**
- `MONGO_URL`: Connection string to your MongoDB instance
- `DB_NAME`: Database name (will be created automatically)
- `JWT_SECRET`: Change this to a strong random string in production
- `NEXT_PUBLIC_BASE_URL`: Frontend URL (localhost:3000 for local development)

---

### Step 4: Start the Development Server

Run the development server:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

**Expected Output:**
```
> next dev --hostname 0.0.0.0 --port 3000

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

---

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the SafetyHub home page with role selection options.

---

## Testing the Application

### Create Test Accounts

1. **Student Account:**
   - Click "Student Login" → "Register"
   - Email: `student@college.edu`
   - Password: `password123`
   - Name: `John Student`
   - Branch: `COMPUTER SCIENCE`

2. **Teacher Account:**
   - Click "Teacher Login" → "Register"
   - Email: `teacher@college.edu`
   - Password: `password123`
   - Name: `Jane Teacher`

3. **Admin Account:**
   - Click "Admin Login" → "Register"
   - Email: `admin@college.edu`
   - Password: `password123`
   - Name: `Admin User`
   - Branch: `COMPUTER SCIENCE`

4. **Principal Account:**
   - Click "Principal Login" → "Register"
   - Email: `principal@college.edu`
   - Password: `password123`
   - Name: `Dr. Principal`

### Test Workflows

**Student Workflow:**
1. Login as student
2. Submit a complaint (e.g., "Bullying" category)
3. View submitted complaints
4. Check analytics dashboard

**Admin Workflow:**
1. Login as admin
2. View complaints from their branch
3. Update complaint status
4. Add responses to complaints

**Principal Workflow:**
1. Login as principal
2. View all complaints from all branches
3. Access system-wide analytics
4. Manage admin and principal accounts

---

## Project Structure

```
project-root/
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # API endpoints (auth, complaints, analytics)
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Main application component
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
├── lib/
│   └── utils.js                  # Utility functions
├── .env.local                    # Environment variables (created)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── package.json                  # Dependencies
└── README.md                     # Project documentation
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Complaints
- `GET /api/complaints` - Get user's complaints (authenticated)
- `POST /api/complaints` - Submit new complaint (authenticated)
- `GET /api/complaints/:id` - Get specific complaint (authenticated)
- `PATCH /api/complaints/:id` - Update complaint (admin/principal only)

### Analytics
- `GET /api/public/stats` - Public statistics (no auth required)
- `GET /api/analytics/stats` - Detailed analytics (authenticated)

### Reference Data
- `GET /api/branches` - Get all branches
- `GET /api/categories` - Get complaint categories

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check `MONGO_URL` in `.env.local`
3. If using MongoDB Atlas, ensure IP whitelist includes your machine

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "JWT_SECRET not set"
**Solution:**
- Ensure `.env.local` file exists in project root
- Add `JWT_SECRET=your-secret-key` to `.env.local`

---

## Building for Production

### Build the application:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Production Checklist:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGO_URL` to production MongoDB instance
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your production domain
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure database backups
- [ ] Set up monitoring and alerts

---

## Performance Optimization

The project includes several optimizations:
- Webpack watch optimization (poll: 2000ms)
- MongoDB indexing on frequently queried fields
- Standalone output for efficient deployment
- Image optimization disabled for development

---

## Security Notes

1. **JWT Secret**: Change the default JWT_SECRET in production
2. **CORS**: Currently set to `*` - restrict in production
3. **Password Hashing**: Uses bcryptjs with 10 salt rounds
4. **Database**: Use MongoDB authentication in production
5. **HTTPS**: Enable in production environment

---

## Support & Documentation

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com/
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check Node version
node --version

# Check npm version
npm --version

# Verify MongoDB connection
mongosh
```

---

**Last Updated:** March 2026
**Project Version:** 0.1.0
