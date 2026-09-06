# SafetyHub - Commands to Run

## 🎯 One-Time Setup Commands

Run these commands once to set up the project:

```bash
# 1. Install all dependencies
npm install

# 2. Verify setup (optional)
node verify-setup.js
```

---

## 🚀 Start Development Server

Run this command to start the application:

```bash
npm run dev
```

**Expected Output:**
```
> next dev --hostname 0.0.0.0 --port 3000

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Then open your browser to: **http://localhost:3000**

---

## 🔄 Alternative Development Commands

```bash
# Development without hot reload
npm run dev:no-reload

# Development with webpack optimization
npm run dev:webpack
```

---

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🗄️ MongoDB Commands

### Start MongoDB (Local)

**Windows:**
```bash
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Connect to MongoDB

```bash
# Using mongosh (newer)
mongosh

# Or using mongo (older)
mongo
```

### Check MongoDB Status

```bash
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017
```

---

## 🧹 Cleanup Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Clear all caches
rm -rf node_modules .next package-lock.json
npm install
```

---

## 🔍 Debugging Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 3000 (Windows)
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

---

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `node verify-setup.js` | Verify setup |
| `mongod` | Start MongoDB |
| `mongosh` | Connect to MongoDB |

---

## 🎯 Complete Workflow

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start MongoDB (in separate terminal)
mongod

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000

# 5. Register and test
# Click any role and register a test account
```

---

## ⚠️ Common Issues & Fixes

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Start MongoDB
mongod

# Verify connection
mongosh
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Clear Cache
```bash
# Remove Next.js cache
rm -rf .next

# Reinstall everything
rm -rf node_modules .next package-lock.json
npm install
```

---

## 📚 Documentation Files

- **QUICK_START.md** - 5-minute quick start
- **DEPLOYMENT_GUIDE.md** - Comprehensive guide
- **SETUP_INSTRUCTIONS.md** - Detailed setup
- **DEPLOYMENT_SUMMARY.md** - Summary of changes
- **RUN_COMMANDS.md** - This file

---

**Ready to deploy!** 🚀
