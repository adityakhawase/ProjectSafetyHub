# 📚 COMPLETE PROJECT DOCUMENTATION - SafetyHub

**Version:** 2.0  
**Date:** July 2026  
**Status:** Production Ready ✅  
**Framework:** Next.js 14.2.18  
**Database:** MongoDB  
**Node.js Version:** 18+ (Currently running on v24.18.0)

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Installation & Setup](#installation--setup)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Frontend Components](#frontend-components)
11. [Authentication & Security](#authentication--security)
12. [Environment Configuration](#environment-configuration)
13. [Running the Application](#running-the-application)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Troubleshooting](#troubleshooting)
17. [Future Enhancements](#future-enhancements)
18. [Creators & Credits](#creators--credits)
19. [License](#license)

---

## 🎯 PROJECT OVERVIEW

**SafetyHub** is a comprehensive Student Safety & Complaint Management System designed for educational institutions. It provides a secure platform where students, teachers, and administrators can report and manage safety-related complaints with proper oversight, transparency, and role-based access control.

### Key Objectives

- Enable secure complaint reporting with optional anonymity
- Provide role-based access control (Student, Teacher, Admin, Principal)
- Track complaint status and resolution in real-time
- Support media uploads (photos/videos) for evidence
- Maintain privacy and security throughout the process
- Offer analytics and insights for better decision-making

### Problem Statement

Educational institutions need a centralized system to:
- Handle safety complaints efficiently
- Maintain student privacy
- Provide accountability and transparency
- Track complaints from submission to resolution
- Enable data-driven decision-making

---

## 🏗️ SYSTEM ARCHITECTURE

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Student   │  │   Admin    │  │ Principal  │            │
│  │ Dashboard  │  │ Dashboard  │  │ Dashboard  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Frontend (React/Next.js)                 │  │
│  │  • Page Components  • UI Components  • State Mgmt    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Backend (API Routes)                     │  │
│  │  • Authentication  • Complaint CRUD  • Analytics     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Users     │  │  Complaints  │  │   Sessions   │     │
│  │  Collection  │  │  Collection  │  │  Collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Authentication**
   - User submits credentials → Frontend validates → API verifies → JWT generated → Stored in localStorage

2. **Complaint Submission**
   - User fills form → Media uploaded (optional) → API validates → Stored in DB → Success response

3. **Admin Response**
   - Admin views complaint → Adds response → API updates → Student notified → Status updated

---

## 💻 TECH STACK

### Frontend
- **Framework:** Next.js 14.2.18 (React 18)
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Fetch API
- **Form Handling:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Next.js API Routes
- **Database:** MongoDB 4.4+
- **ODM:** Native MongoDB Driver
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

### Development Tools
- **Package Manager:** npm / yarn
- **CSS Processing:** PostCSS, Autoprefixer
- **Code Quality:** ESLint (via Next.js)
- **Version Control:** Git

---

## ✨ FEATURES

### Core Features

#### 1. **Authentication System**
- User registration with role selection (Student, Teacher, Admin, Principal)
- Secure login with JWT token generation
- Session persistence using localStorage
- Role-based access control
- Account limits (Admin: 16 max, Principal: 3 max)

#### 2. **Complaint Management**
- Create complaints with title, description, category, and branch
- Optional anonymous submission (identity masked from other users)
- Media upload support (JPEG, PNG, GIF, MP4, WebM, MOV - max 50MB)
- Real-time status tracking (Pending, In Progress, Resolved)
- Response system for admin/principal feedback
- Complaint history and timeline

#### 3. **Media Upload**
- Support for images (JPEG, PNG, GIF) and videos (MP4, WebM, MOV)
- File size limit: 50MB
- Base64 encoding for storage
- Preview before submission
- Required for certain categories (Bullying, Ragging, Infrastructure Issue)

#### 4. **Anonymous Privacy**
- Students can submit complaints anonymously
- Real identity stored in database
- Display name masked as "Anonymous" for non-admin/principal users
- Admin and Principal can see real identity
- Anonymous badge displayed in UI

#### 5. **Response System**
- Admin/Principal can respond to complaints
- Update complaint status (Pending → In Progress → Resolved)
- Add response messages with timestamps
- Track responder name and role
- Multiple responses per complaint

#### 6. **Delete Functionality**
- Admin can delete complaints from their branch only
- Principal can delete complaints from any branch
- Confirmation dialog before deletion
- Prevents accidental deletion
- Soft delete option (future enhancement)

#### 7. **Analytics Dashboard**
- Total complaints submitted
- Total complaints resolved
- Complaints by status (Pending, In Progress, Resolved)
- Branch-wise statistics
- Category-wise breakdown
- Resolution rate calculation
- Public statistics (no authentication required)

#### 8. **Branch Management**
Available branches:
- AIML (Artificial Intelligence & Machine Learning)
- Computer Science
- Mechanical Engineering
- Civil Engineering
- Electronics and Telecommunication
- Electrical Engineering

#### 9. **Complaint Categories**
- Harassment
- Bullying
- Ragging
- Safety Concern
- Infrastructure Issue (Auto-replied)
- Hostel Issue
- Medical Emergency
- Other

#### 10. **UI/UX Features**
- Responsive design (mobile, tablet, desktop)
- Edge animations and wobbling shapes
- Sticky forms for easy access
- Filter complaints by status and category
- Real-time relative timestamps
- Loading states and error handling
- Success/error notifications
- Settings panel (future enhancement)

---

## 👥 USER ROLES & PERMISSIONS

### 1. Student (Unlimited Accounts)

**Permissions:**
- ✅ Create complaints (anonymous or identified)
- ✅ View own complaints and their status
- ✅ Track complaint responses
- ✅ Upload media (photos/videos)
- ✅ View personal analytics
- ❌ Cannot delete or modify complaints after submission
- ❌ Cannot see other students' complaints
- ❌ Cannot respond to complaints

**Dashboard Features:**
- New complaint form (sticky)
- Complaint list with filters
- Status badges
- Response display
- Media preview
- Personal analytics

### 2. Teacher (Unlimited Accounts)

**Permissions:**
- Same as Student role
- ✅ Can report issues from their branch
- ❌ Cannot manage other users' complaints
- ❌ Cannot see complaints from other branches

**Dashboard Features:**
- Identical to Student Dashboard
- Can submit complaints on behalf of students

### 3. Admin (Maximum 16 Accounts)

**Permissions:**
- ✅ View all complaints from their assigned branch
- ✅ Respond to complaints
- ✅ Update complaint status (Pending, In Progress, Resolved)
- ✅ Delete complaints from their branch only
- ✅ View branch-specific analytics
- ✅ See real identity of anonymous complaints
- ❌ Cannot access complaints from other branches
- ❌ Cannot create new complaints
- ❌ Cannot modify user accounts

**Dashboard Features:**
- All branch complaints view
- Complaint details modal
- Response form
- Status update dropdown
- Delete button (branch-restricted)
- Branch-specific analytics

### 4. Principal (Maximum 3 Accounts)

**Permissions:**
- ✅ View ALL complaints from ALL branches
- ✅ Respond to any complaint
- ✅ Update any complaint status
- ✅ Delete any complaint from any branch
- ✅ View system-wide analytics
- ✅ See real identity of all anonymous complaints
- ✅ Full oversight of the entire system
- ❌ Cannot create new complaints
- ❌ Cannot modify user accounts

**Dashboard Features:**
- System-wide complaints view
- Cross-branch management
- Full complaint management
- Delete functionality (unrestricted)
- Response system
- System-wide analytics
- Branch filtering

---

## 🚀 INSTALLATION & SETUP

### Prerequisites

Before installing, ensure you have:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas/register
   - Verify: `mongod --version`

3. **npm or yarn** (comes with Node.js)
   - Verify: `npm --version` or `yarn --version`

4. **System Requirements**
   - RAM: 2GB+
   - Disk Space: 500MB+
   - Internet connection (for initial setup)

### Step 1: Clone or Download Project

If using Git:
```bash
git clone <repository-url>
cd ProjectSafetyHub
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages including:
- Next.js and React
- MongoDB driver
- JWT and bcrypt
- Tailwind CSS and shadcn/ui components
- All other dependencies from package.json

### Step 3: Configure Environment Variables

The project already includes a `.env.local` file with default configuration:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**Important:** Change `JWT_SECRET` before deploying to production!

### Step 4: Start MongoDB

Make sure MongoDB is running:

```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

Or if using MongoDB Atlas, ensure your connection string is correct in `.env.local`.

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start on http://localhost:3000

### Step 6: Verify Installation

Run the verification script:

```bash
node verify-setup.js
```

This checks:
- Node.js version
- Dependencies installation
- Environment configuration
- MongoDB connection

---

## 📁 PROJECT STRUCTURE

```
ProjectSafetyHub/
│
├── app/                          # Next.js App Directory
│   ├── api/                      # API Routes
│   │   └── [[...path]]/
│   │       └── route.js          # Catch-all API handler
│   ├── globals.css               # Global styles & animations
│   ├── layout.js                 # Root layout component
│   └── page.js                   # Main application component (2958 lines)
│
├── components/                   # React Components
│   └── ui/                       # shadcn/ui components (50+ files)
│       ├── accordion.jsx
│       ├── alert-dialog.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── input.jsx
│       ├── select.jsx
│       └── ... (47 more components)
│
├── hooks/                        # Custom React Hooks
│   ├── use-mobile.jsx            # Mobile detection hook
│   └── use-toast.js              # Toast notification hook
│
├── lib/                          # Utility Functions
│   └── utils.js                  # Helper functions (cn, etc.)
│
├── public/                       # Static Assets
│   └── shield-icon.svg           # Application icon
│
├── GUIDES/                       # Documentation (25+ files)
│   ├── START_HERE.md
│   ├── QUICK_START.md
│   ├── DETAILED_DEPLOYMENT_STEPS.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── PROJECT_LOGIC.md
│   └── ... (20+ more guides)
│
├── tests/                        # Test Files
│   ├── backend_test.py
│   ├── debug_test.py
│   ├── enhanced_features_test.py
│   └── targeted_test.py
│
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore file
├── components.json               # shadcn/ui configuration
├── jsconfig.json                 # JavaScript configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── README.md                     # Project README
├── PROJECT_LOGIC.md              # Detailed logic documentation
└── verify-setup.js               # Setup verification script
```

---

