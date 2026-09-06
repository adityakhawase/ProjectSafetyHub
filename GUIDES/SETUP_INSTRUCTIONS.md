# SafetyHub - Complete Setup Instructions

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally or MongoDB Atlas account
- Terminal/Command Prompt access

### Steps
1. **Install dependencies**: `npm install`
2. **Verify .env.local exists** (already created)
3. **Start server**: `npm run dev`
4. **Open browser**: http://localhost:3000
5. **Register/Login** with any role

---

## 📋 Detailed Setup Guide

### Step 1: Install Node.js
- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` and `npm --version`

### Step 2: Install MongoDB
**Option A - Local Installation:**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Verify: `mongosh` or `mongo` command

**Option B - MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update MONGO_URL in .env.local

### Step 3: Install Project Dependencies
```bash
npm install
```

### Step 4: Verify Configuration
- Check .env.local exists in project root
- Verify MONGO_URL points to your MongoDB instance
- Ensure JWT_SECRET is set

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Access Application
Open http://localhost:3000 in your browser

---

## ✅ Verification Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB running
- [ ] .env.local file exists
- [ ] npm install completed
- [ ] No error messages in terminal
- [ ] Browser shows SafetyHub home page
- [ ] Can register/login successfully

---

## 🔧 Troubleshooting

See DEPLOYMENT_GUIDE.md for detailed troubleshooting steps.

---

## 📚 Documentation Files

- **QUICK_START.md** - 5-minute quick start guide
- **DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
- **SETUP_INSTRUCTIONS.md** - This file
- **README.md** - Project overview
