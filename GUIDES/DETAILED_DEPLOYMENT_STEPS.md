# SafetyHub - Detailed Step-by-Step Deployment Guide

## Complete Instructions for Local Deployment

---

## PART 1: PREREQUISITES INSTALLATION

### Step 1.1: Install Node.js

**What is Node.js?**
Node.js is a JavaScript runtime that allows you to run JavaScript on your computer (not just in browsers).

**Installation Steps:**

1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version (recommended)
3. Run the installer
4. Follow the installation wizard:
   - Click "Next" through all screens
   - Accept the license agreement
   - Choose default installation path
   - Click "Install"
5. Restart your computer (recommended)

**Verify Installation:**

Open Command Prompt or PowerShell and type:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v18.17.0
9.6.7
```

If you see version numbers, Node.js is installed correctly ✓

---

### Step 1.2: Install MongoDB

**What is MongoDB?**
MongoDB is a database that stores your application data (users, complaints, etc.).

**Option A: Local MongoDB Installation (Recommended for Learning)**

1. Go to https://www.mongodb.com/try/download/community
2. Select your operating system:
   - **Windows**: Download MSI installer
   - **Mac**: Download DMG file
   - **Linux**: Follow Linux instructions
3. Run the installer
4. Follow the installation wizard:
   - Accept license agreement
   - Choose "Complete" installation
   - Install MongoDB as a service
   - Click "Install"
5. MongoDB will start automatically

**Verify MongoDB is Running:**

Open Command Prompt and type:
```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
```

If you see this, MongoDB is running ✓

Type `exit` to close MongoDB shell.

**Option B: MongoDB Atlas (Cloud - No Installation Needed)**

If you don't want to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create an account
4. Create a new project
5. Create a free cluster
6. Get your connection string
7. Update `.env.local` file:
   ```
   MONGO_URL=your_connection_string_here
   ```

---

### Step 1.3: Install Git (Optional but Recommended)

**What is Git?**
Git is version control software to track code changes.

1. Go to https://git-scm.com/
2. Download for your OS
3. Run installer with default settings
4. Verify: Open Command Prompt and type `git --version`

---

## PART 2: PROJECT SETUP

### Step 2.1: Navigate to Project Directory

1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```bash
   cd path/to/your/project
   ```
   
   Example:
   ```bash
   cd C:\Users\YourName\Desktop\safetyhub
   ```

3. Verify you're in the right folder by typing:
   ```bash
   dir
   ```
   
   You should see files like:
   - package.json
   - next.config.js
   - app/
   - components/
   - .env.local

---

### Step 2.2: Verify .env.local File

The `.env.local` file should already exist in your project root.

**Check if it exists:**
```bash
type .env.local
```

**Expected content:**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

If the file doesn't exist or is empty, create it with the content above.

---

### Step 2.3: Install Project Dependencies

**What are dependencies?**
Dependencies are libraries and packages your project needs to run.

**Installation Command:**
```bash
npm install
```

**What happens:**
- npm reads package.json
- Downloads all required packages
- Creates node_modules folder
- Creates package-lock.json file

**Expected Output:**
```
added 500+ packages in 2m
```

**This may take 2-5 minutes depending on your internet speed.**

**Verify Installation:**
Check if node_modules folder was created:
```bash
dir
```

You should see a `node_modules` folder ✓

---

## PART 3: DATABASE SETUP

### Step 3.1: Start MongoDB Service

**For Windows:**

MongoDB should start automatically after installation. To verify:

1. Open Command Prompt
2. Type:
   ```bash
   mongod
   ```

3. You should see:
   ```
   [initandlisten] waiting for connections on port 27017
   ```

4. Keep this window open (don't close it)

**For Mac:**
```bash
brew services start mongodb-community
```

**For Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 3.2: Verify MongoDB Connection

**In a NEW Command Prompt window** (keep the mongod window open):

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
```

Type `exit` to close.

---

### Step 3.3: Create Database (Automatic)

The database will be created automatically when you first run the application. You don't need to do anything manually.

---

## PART 4: START THE APPLICATION

### Step 4.1: Start Development Server

**In your project directory** (in Command Prompt):

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

**Keep this window open** - this is your development server running.

---

### Step 4.2: Open Application in Browser

1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Go to: **http://localhost:3000**
3. You should see the SafetyHub home page with:
   - SafetyHub logo
   - "Your Safety, Our Priority" heading
   - 4 role buttons (Student, Teacher, Admin, Principal)
   - System Overview statistics

If you see this, your application is running successfully ✓

---

## PART 5: TEST THE APPLICATION

### Step 5.1: Create a Student Account

1. Click **"Student Login"** button
2. Click **"Don't have an account? Register"**
3. Fill in the registration form:
   - **Full Name**: John Student
   - **Email**: student@test.com
   - **Password**: test123
   - **Branch**: COMPUTER SCIENCE
4. Click **"Create Account"**
5. You should be logged in and see the Student Dashboard

---

### Step 5.2: Submit a Complaint (Student)

1. Click **"Submit Complaint"** button
2. Fill in the form:
   - **Title**: Test Complaint
   - **Description**: This is a test complaint
   - **Category**: Bullying
   - **Branch**: COMPUTER SCIENCE
   - **Keep Anonymous**: Leave unchecked
3. Click **"Submit"**
4. You should see success message
5. Click **"View My Complaints"** to see your submitted complaint

---

### Step 5.3: Create an Admin Account

1. Go back to home page (click SafetyHub logo or back button)
2. Click **"Admin Login"** button
3. Click **"Request account registration"**
4. Fill in the registration form:
   - **Full Name**: Admin User
   - **Email**: admin@test.com
   - **Password**: test123
   - **Branch**: COMPUTER SCIENCE
5. Click **"Create Account"**
6. You should be logged in and see the Admin Dashboard

---

### Step 5.4: Respond to Complaint (Admin)

1. In Admin Dashboard, you should see the complaint you submitted as student
2. Click on the complaint to view details
3. Click **"Add Response"** button
4. Type a response: "We are looking into this issue"
5. Select status: "In Progress"
6. Click **"Update"**
7. The complaint status should change to "In Progress"

---

### Step 5.5: Create a Principal Account

1. Go back to home page
2. Click **"Principal Login"** button
3. Click **"Request account registration"**
4. Fill in the registration form:
   - **Full Name**: Dr. Principal
   - **Email**: principal@test.com
   - **Password**: test123
5. Click **"Create Account"**
6. You should see Principal Dashboard with all complaints from all branches

---

### Step 5.6: View Analytics

1. In any dashboard, click **"Analytics"** tab
2. You should see:
   - Total complaints submitted
   - Total complaints resolved
   - Branch-wise statistics
   - Category-wise breakdown
   - Resolution rates

---

## PART 6: TROUBLESHOOTING

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   mongosh
   ```
2. If it fails, start MongoDB:
   ```bash
   mongod
   ```
3. Check `.env.local` has correct MONGO_URL
4. Restart the development server

---

### Issue: "Port 3000 already in use"

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Replace `<PID>` with the process ID shown.

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Then restart: `npm run dev`

---

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue: "Blank page or errors in browser"

**Solution:**
1. Open browser console: Press **F12**
2. Check for error messages
3. Look at the terminal where you ran `npm run dev`
4. Check for error messages there
5. Share the error message for help

---

### Issue: "Cannot register account"

**Solution:**
1. Make sure MongoDB is running
2. Check `.env.local` file exists
3. Check email is not already used
4. Try a different email address

---

## PART 7: COMMON COMMANDS

### Development Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Stop development server:**
Press `Ctrl + C` in the terminal

---

### MongoDB Commands

**Start MongoDB:**
```bash
mongod
```

**Connect to MongoDB:**
```bash
mongosh
```

**View databases:**
```bash
show databases
```

**View collections:**
```bash
use student_safety_db
show collections
```

---

### Useful Shortcuts

**Clear terminal:**
```bash
clear
```

**List files in directory:**
```bash
dir
```

**Navigate to folder:**
```bash
cd path/to/folder
```

**Go back one folder:**
```bash
cd ..
```

---

## PART 8: PROJECT STRUCTURE EXPLAINED

```
project-root/
│
├── app/                          # Main application folder
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # API endpoints (backend)
│   ├── page.js                   # Main page (frontend)
│   ├── layout.js                 # Page layout
│   └── globals.css               # Global styles
│
├── components/
│   └── ui/                       # UI components (buttons, forms, etc.)
│
├── hooks/                        # Custom React hooks
│
├── lib/
│   └── utils.js                  # Utility functions
│
├── .env.local                    # Environment variables (SECRET - don't share)
├── package.json                  # Project dependencies
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # Project documentation
```

---

## PART 9: UNDERSTANDING THE APPLICATION

### User Roles

**Student:**
- Submit complaints
- View own complaints
- View analytics
- Option to submit anonymously

**Teacher:**
- Submit complaints
- View own complaints
- View analytics
- Option to submit anonymously

**Admin:**
- View all complaints in their branch
- Update complaint status
- Add responses to complaints
- View branch analytics

**Principal:**
- View all complaints from all branches
- Update any complaint
- Add responses to any complaint
- View system-wide analytics

---

### Complaint Status

**Pending:**
- Complaint just submitted
- Waiting for admin response

**In Progress:**
- Admin is working on the complaint
- Admin has added a response

**Resolved:**
- Issue has been resolved
- Final response sent to student

---

### Complaint Categories

- Harassment
- Bullying
- Ragging
- Safety Concern
- Infrastructure Issue
- Hostel Issue
- Medical Emergency
- Other

---

## PART 10: NEXT STEPS

### After Testing Locally

1. **Customize the application:**
   - Change branches (in app/api/[[...path]]/route.js)
   - Change categories
   - Modify UI colors/styling

2. **Add more features:**
   - Email notifications
   - File uploads
   - Advanced filtering
   - Export reports

3. **Deploy to production:**
   - Choose hosting platform (Vercel, Heroku, AWS, etc.)
   - Set up production MongoDB
   - Configure environment variables
   - Deploy application

---

## PART 11: PRODUCTION DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update MONGO_URL to production database
- [ ] Set NEXT_PUBLIC_BASE_URL to your domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Set up monitoring
- [ ] Test all features thoroughly
- [ ] Set up automated tests
- [ ] Configure rate limiting

---

## PART 12: GETTING HELP

### Documentation Files

- **START_HERE.md** - Quick overview
- **QUICK_START.md** - 5-minute setup
- **DEPLOYMENT_GUIDE.md** - Comprehensive guide
- **RUN_COMMANDS.md** - All commands
- **VISUAL_GUIDE.md** - Architecture diagrams

### Online Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **MongoDB Documentation**: https://docs.mongodb.com/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Common Issues

Check DEPLOYMENT_GUIDE.md for detailed troubleshooting section.

---

## SUMMARY

You now have:

✅ Node.js installed
✅ MongoDB installed and running
✅ Project dependencies installed
✅ Environment configured
✅ Development server running
✅ Application accessible at http://localhost:3000
✅ Test accounts created
✅ Features tested

**Your SafetyHub application is ready to use!**

---

**Last Updated**: March 2026
**Version**: 0.1.0
**Status**: ✅ READY FOR LOCAL DEPLOYMENT
