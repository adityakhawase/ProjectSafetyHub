# SafetyHub - Quick Reference Card

## 🎯 One-Page Quick Reference

---

## INSTALLATION CHECKLIST

```
☐ Install Node.js from https://nodejs.org/
  └─ Verify: node --version

☐ Install MongoDB from https://www.mongodb.com/try/download/community
  └─ Verify: mongosh

☐ Navigate to project folder
  └─ Command: cd path/to/project

☐ Install dependencies
  └─ Command: npm install

☐ Verify .env.local exists
  └─ Check: type .env.local
```

---

## STARTUP SEQUENCE

### Terminal 1 - Start MongoDB
```bash
mongod
# Keep this running
```

### Terminal 2 - Start Development Server
```bash
cd path/to/project
npm run dev
# Keep this running
```

### Browser
```
Open: http://localhost:3000
```

---

## TEST ACCOUNTS

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | test123 |
| Teacher | teacher@test.com | test123 |
| Admin | admin@test.com | test123 |
| Principal | principal@test.com | test123 |

---

## QUICK COMMANDS

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Stop server
Ctrl + C

# Start MongoDB
mongod

# Connect to MongoDB
mongosh

# Check Node version
node --version

# Check npm version
npm --version
```

---

## TROUBLESHOOTING QUICK FIXES

| Problem | Solution |
|---------|----------|
| MongoDB not connecting | Run `mongod` in separate terminal |
| Port 3000 in use | Kill process: `taskkill /PID <PID> /F` |
| Module not found | Run `npm install` again |
| Blank page | Press F12, check console for errors |
| Can't register | Make sure MongoDB is running |

---

## FILE LOCATIONS

```
.env.local              ← Environment variables
app/page.js             ← Main application
app/api/[[...path]]/    ← API endpoints
components/ui/          ← UI components
package.json            ← Dependencies
```

---

## IMPORTANT URLS

```
Application:    http://localhost:3000
MongoDB:        mongodb://localhost:27017
API Base:       http://localhost:3000/api
```

---

## ENVIRONMENT VARIABLES

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
JWT_SECRET=your-secret-key
```

---

## USER ROLES & PERMISSIONS

```
STUDENT
├─ Submit complaints
├─ View own complaints
├─ View analytics
└─ Anonymous option

TEACHER
├─ Submit complaints
├─ View own complaints
├─ View analytics
└─ Anonymous option

ADMIN
├─ View branch complaints
├─ Update status
├─ Add responses
└─ View branch analytics

PRINCIPAL
├─ View all complaints
├─ Update any complaint
├─ Add responses
└─ View all analytics
```

---

## COMPLAINT STATUS FLOW

```
SUBMITTED → PENDING → IN-PROGRESS → RESOLVED → CLOSED
```

---

## COMPLAINT CATEGORIES

```
• Harassment
• Bullying
• Ragging
• Safety Concern
• Infrastructure Issue
• Hostel Issue
• Medical Emergency
• Other
```

---

## BRANCHES

```
• AIML
• COMPUTER SCIENCE
• MECHANICAL ENGINEERING
• CIVIL ENGINEERING
• ELECTRONICS AND TELECOMMUNICATION
• ELECTRICAL ENGINEERING
• STAFF
```

---

## KEYBOARD SHORTCUTS

```
F12             ← Open browser developer tools
Ctrl + C        ← Stop running process
Ctrl + L        ← Clear terminal (Windows)
clear           ← Clear terminal (Mac/Linux)
```

---

## COMMON ERRORS & FIXES

### "Cannot find module"
```bash
npm install
npm run dev
```

### "EADDRINUSE: address already in use :::3000"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "MongoServerError: connect ECONNREFUSED"
```bash
mongod
# Start MongoDB in separate terminal
```

### "MONGO_URL is not defined"
```bash
# Check .env.local exists
type .env.local
# Should show MONGO_URL=mongodb://localhost:27017
```

---

## TESTING WORKFLOW

```
1. Register as Student
   └─ Submit complaint

2. Register as Admin
   └─ View complaint
   └─ Update status
   └─ Add response

3. Register as Principal
   └─ View all complaints
   └─ Check analytics

4. View Public Stats
   └─ No login required
```

---

## PRODUCTION CHECKLIST

```
☐ Change JWT_SECRET
☐ Update MONGO_URL to production
☐ Set NEXT_PUBLIC_BASE_URL to domain
☐ Enable HTTPS
☐ Set up backups
☐ Configure monitoring
☐ Test all features
☐ Deploy to hosting
```

---

## DOCUMENTATION FILES

```
START_HERE.md
├─ Entry point

DETAILED_DEPLOYMENT_STEPS.md
├─ Complete step-by-step guide

QUICK_START.md
├─ 5-minute quick start

DEPLOYMENT_GUIDE.md
├─ Comprehensive guide

RUN_COMMANDS.md
├─ All commands

VISUAL_GUIDE.md
├─ Architecture diagrams

FINAL_CHECKLIST.md
├─ Verification checklist
```

---

## SUPPORT RESOURCES

```
Next.js:        https://nextjs.org/docs
MongoDB:        https://docs.mongodb.com/
React:          https://react.dev/
Tailwind CSS:   https://tailwindcss.com/docs
```

---

## QUICK STATS

```
Total Endpoints:        8+
Total UI Components:    50+
Database Collections:   2
User Roles:             4
Complaint Categories:   8
Branches:               7
```

---

## PERFORMANCE TARGETS

```
Page Load:      < 2 seconds
API Response:   < 500ms
Database Query: < 100ms
Memory Usage:   ~200-300MB
```

---

## SYSTEM REQUIREMENTS

```
Node.js:    v18+
npm:        v9+
MongoDB:    v4.4+
RAM:        2GB+
Disk:       500MB+
```

---

## QUICK START (3 STEPS)

```bash
# Step 1: Install
npm install

# Step 2: Start MongoDB (separate terminal)
mongod

# Step 3: Start server
npm run dev

# Open: http://localhost:3000
```

---

**Print this page for quick reference!** 📋

Last Updated: March 2026
