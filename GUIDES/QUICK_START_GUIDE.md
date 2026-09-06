# SafetyHub - Quick Start Guide

**Get SafetyHub running in 5 minutes!**

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Start MongoDB (1 min)
Open a new terminal and run:
```bash
mongod
```
Keep this terminal open.

### Step 3: Start Development Server (1 min)
In your original terminal:
```bash
npm run dev
```

### Step 4: Open Browser (1 min)
Go to: `http://localhost:3000`

---

## 🧪 Test the System

### Create Student Account
1. Click **"Student Login"**
2. Click **"Don't have an account? Register"**
3. Fill form:
   - Name: John Student
   - Email: student@test.com
   - Password: test123
   - Branch: COMPUTER SCIENCE
4. Click **"Create Account"**

### Submit a Complaint
1. Click **"Submit Complaint"**
2. Fill form:
   - Title: Test Complaint
   - Description: This is a test
   - Category: Bullying
   - Branch: COMPUTER SCIENCE
3. Upload a photo/video (required for Bullying)
4. Click **"Submit"**

### Create Admin Account
1. Go back to home
2. Click **"Admin Login"**
3. Click **"Request account registration"**
4. Fill form:
   - Name: Admin User
   - Email: admin@test.com
   - Password: test123
   - Branch: COMPUTER SCIENCE
5. Click **"Create Account"**

### Respond to Complaint
1. Click on the complaint
2. Type response: "We are looking into this"
3. Select status: "In Progress"
4. Click **"Update"**

---

## 📋 Test Accounts

```
Student:
  Email: student@test.com
  Password: test123

Teacher:
  Email: teacher@test.com
  Password: test123

Admin:
  Email: admin@test.com
  Password: test123

Principal:
  Email: principal@test.com
  Password: test123
```

---

## 🎯 Key Features to Test

- ✅ User registration and login
- ✅ Complaint submission
- ✅ Media upload (photo/video)
- ✅ Anonymous complaints
- ✅ Complaint status updates
- ✅ Admin responses
- ✅ Delete complaints
- ✅ Analytics dashboard
- ✅ Role-based access

---

## 🔧 Troubleshooting

### MongoDB Not Running
```bash
mongod
```

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
npm install
npm run dev
```

### Clear Cache
```bash
rm -r .next
npm run dev
```

---

## 📚 Full Documentation

- `CURRENT_STATUS.md` - Current implementation
- `FINAL_SYSTEM_STATUS.md` - System status
- `DETAILED_DEPLOYMENT_STEPS.md` - Complete guide
- `ALL_STEPS_SUMMARY.md` - Full overview

---

## ✨ You're Ready!

Everything is set up and ready to go. Start with Step 1 above and you'll have SafetyHub running in 5 minutes!

**Happy testing!** 🚀
