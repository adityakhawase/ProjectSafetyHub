# Setup Steps - SafetyHub

**Time Required**: 5 minutes  
**Difficulty**: Easy

---

## 📋 Prerequisites

Before starting, make sure you have completed:
- ✅ Node.js installed
- ✅ MongoDB installed
- ✅ Project dependencies installed (`npm install`)

---

## Step 1: Start MongoDB (1 minute)

### Windows

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Verify**
   - Should show: `[initandlisten] waiting for connections on port 27017`
   - **Keep this window open!**

### Mac/Linux

```bash
mongod
```

---

## Step 2: Start Development Server (1 minute)

### Open New Command Prompt/Terminal

1. **Open New Terminal**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter
   - (Or open new tab in existing terminal)

2. **Navigate to Project**
   ```bash
   cd C:\Users\Lenovo\Desktop\ProjectSafetyHub
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

4. **Verify**
   - Should show:
   ```
   ✓ Ready in 2.5s
   - Local: http://localhost:3000
   ```
   - **Keep this window open!**

---

## Step 3: Open Application (1 minute)

1. **Open Web Browser**
   - Chrome, Firefox, Edge, or Safari

2. **Go to URL**
   ```
   http://localhost:3000
   ```

3. **Verify**
   - Should see SafetyHub home page with:
     - SafetyHub logo
     - "Your Safety, Our Priority" heading
     - 4 role buttons (Student, Teacher, Admin, Principal)
     - System statistics

---

## ✅ Setup Complete!

Your SafetyHub application is now running!

---

## 📊 What's Running

| Service | Status | Port |
|---------|--------|------|
| MongoDB | ✅ Running | 27017 |
| Dev Server | ✅ Running | 3000 |
| Application | ✅ Ready | http://localhost:3000 |

---

## 🧪 Quick Test

### Create a Student Account

1. **Click "Student Login"**
2. **Click "Don't have an account? Register"**
3. **Fill Form**
   - Name: John Student
   - Email: student@test.com
   - Password: test123
   - Branch: COMPUTER SCIENCE
4. **Click "Create Account"**
5. **You're logged in!** ✅

---

## 🛑 Stopping the Application

### To Stop Dev Server
- In dev server terminal: Press `Ctrl + C`

### To Stop MongoDB
- In MongoDB terminal: Press `Ctrl + C`

---

## 🔄 Restarting

To restart the application:

1. **Stop both services** (Ctrl + C)
2. **Start MongoDB** (Step 1)
3. **Start Dev Server** (Step 2)
4. **Open browser** (Step 3)

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- **Problem**: `MongoServerError: connect ECONNREFUSED`
- **Solution**: Make sure MongoDB is running (Step 1)

### Port 3000 Already in Use
- **Problem**: `Error: listen EADDRINUSE: address already in use :::3000`
- **Solution**:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Port 27017 Already in Use
- **Problem**: MongoDB won't start
- **Solution**:
  ```bash
  # Windows
  netstat -ano | findstr :27017
  taskkill /PID <PID> /F
  ```

### Blank Page
- **Problem**: Browser shows blank page
- **Solution**:
  - Press F12 to open developer console
  - Check for error messages
  - Check terminal for errors
  - Restart dev server

### Module Not Found
- **Problem**: `Error: Cannot find module`
- **Solution**:
  ```bash
  npm install
  npm run dev
  ```

---

## 📝 Next Steps

After setup is complete:
1. Read: `GUIDES/STEPS/TESTING_STEPS.md`
2. Test all features
3. Create test accounts
4. Submit test complaints

---

## 💡 Tips

- **Keep terminals open**: Don't close MongoDB or dev server terminals
- **Use separate terminals**: Use different terminal windows for MongoDB and dev server
- **Check ports**: Make sure ports 3000 and 27017 are not in use
- **Restart if needed**: If something goes wrong, restart both services

---

**Status**: ✅ Setup Guide Complete
