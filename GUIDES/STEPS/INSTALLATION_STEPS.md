# Installation Steps - SafetyHub

**Time Required**: 10-15 minutes  
**Difficulty**: Easy

---

## 📋 Prerequisites

Before starting, make sure you have:
- Windows/Mac/Linux computer
- Internet connection
- Administrator access (for installations)

---

## Step 1: Install Node.js (5 minutes)

### What is Node.js?
Node.js is a JavaScript runtime that allows you to run JavaScript on your computer.

### Installation Steps

1. **Go to Node.js Website**
   - Visit: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version

2. **Run Installer**
   - Double-click the downloaded file
   - Click "Next" through the wizard
   - Accept default settings
   - Click "Install"

3. **Restart Computer**
   - Restart your computer after installation

4. **Verify Installation**
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Run:
   ```bash
   node --version
   npm --version
   ```
   - Should show version numbers like `v18.17.0` and `9.6.7`

---

## Step 2: Install MongoDB (5 minutes)

### Option A: Local Installation (Recommended)

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Select your operating system
   - Download the installer

2. **Run Installer**
   - Double-click the downloaded file
   - Click "Next" through the wizard
   - Accept default settings
   - Click "Install"

3. **Verify Installation**
   - Open Command Prompt
   - Run:
   ```bash
   mongosh
   ```
   - Should connect to MongoDB

### Option B: MongoDB Atlas (Cloud)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Follow the setup wizard
   - Create a free cluster

3. **Get Connection String**
   - Copy the connection string
   - Update `MONGO_URL` in `.env.local`

---

## Step 3: Navigate to Project (1 minute)

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Navigate to Project**
   ```bash
   cd C:\Users\Lenovo\Desktop\ProjectSafetyHub
   ```

3. **Verify Location**
   ```bash
   dir
   ```
   - Should show: `package.json`, `app/`, `components/`, etc.

---

## Step 4: Install Project Dependencies (5 minutes)

1. **Run Installation**
   ```bash
   npm install
   ```
   - This downloads all required packages
   - Wait for it to complete (may take 3-5 minutes)

2. **Verify Installation**
   ```bash
   dir
   ```
   - Should show `node_modules` folder created

---

## Step 5: Verify Environment Variables (1 minute)

1. **Check `.env.local` File**
   - Open `.env.local` in your editor
   - Should contain:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=student_safety_db
   JWT_SECRET=your-secret-key-change-in-production
   ```

2. **If Missing**
   - Create `.env.local` file
   - Add the above variables

---

## ✅ Installation Complete!

You've successfully installed:
- ✅ Node.js
- ✅ MongoDB
- ✅ Project dependencies
- ✅ Environment variables

---

## 🔧 Troubleshooting

### Node.js Not Found
- **Problem**: `node: command not found`
- **Solution**: Restart computer after Node.js installation

### MongoDB Not Found
- **Problem**: `mongosh: command not found`
- **Solution**: Restart computer after MongoDB installation

### npm install Fails
- **Problem**: Installation errors
- **Solution**:
  ```bash
  npm cache clean --force
  npm install
  ```

### Port Already in Use
- **Problem**: Port 3000 or 27017 already in use
- **Solution**: Kill the process or use different port

---

## 📝 Next Steps

After installation is complete:
1. Read: `GUIDES/STEPS/SETUP_STEPS.md`
2. Start MongoDB and dev server
3. Test the application

---

**Status**: ✅ Installation Guide Complete
