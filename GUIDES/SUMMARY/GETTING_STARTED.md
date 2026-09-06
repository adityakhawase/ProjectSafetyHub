# Getting Started with SafetyHub

**Welcome to SafetyHub!** 🎉

This guide will help you get started with the SafetyHub complaint management system.

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
mongod
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:3000
```

**Done!** SafetyHub is running! 🎉

---

## 📚 Documentation Structure

### GUIDES/SUMMARY/
- **PROJECT_OVERVIEW.md** - What is SafetyHub?
- **GETTING_STARTED.md** - This file
- **FEATURES_SUMMARY.md** - Feature overview

### GUIDES/STEPS/
- **INSTALLATION_STEPS.md** - Install Node.js, MongoDB, dependencies
- **SETUP_STEPS.md** - Start MongoDB and dev server
- **TESTING_STEPS.md** - Test all features
- **DEPLOYMENT_STEPS.md** - Deploy to production

### GUIDES/DEPLOYMENT/
- **DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
- **DETAILED_DEPLOYMENT_STEPS.md** - Step-by-step deployment
- **PRODUCTION_CHECKLIST.md** - Pre-production checklist

### GUIDES/FEATURES/
- **ANONYMOUS_USER_PRIVACY.md** - Anonymous complaint feature
- **MEDIA_UPLOAD_FEATURE.md** - Photo/video upload
- **DELETE_COMPLAINTS_FEATURE.md** - Delete complaints

---

## 🎯 Choose Your Path

### Path 1: I'm New to This
1. Read: `GUIDES/SUMMARY/PROJECT_OVERVIEW.md`
2. Follow: `GUIDES/STEPS/INSTALLATION_STEPS.md`
3. Follow: `GUIDES/STEPS/SETUP_STEPS.md`
4. Follow: `GUIDES/STEPS/TESTING_STEPS.md`

### Path 2: I Want to Deploy
1. Read: `GUIDES/SUMMARY/PROJECT_OVERVIEW.md`
2. Follow: `GUIDES/STEPS/INSTALLATION_STEPS.md`
3. Follow: `GUIDES/STEPS/SETUP_STEPS.md`
4. Follow: `GUIDES/STEPS/TESTING_STEPS.md`
5. Follow: `GUIDES/STEPS/DEPLOYMENT_STEPS.md`

### Path 3: I Want to Learn Features
1. Read: `GUIDES/SUMMARY/PROJECT_OVERVIEW.md`
2. Read: `GUIDES/SUMMARY/FEATURES_SUMMARY.md`
3. Read: `GUIDES/FEATURES/ANONYMOUS_USER_PRIVACY.md`
4. Read: `GUIDES/FEATURES/MEDIA_UPLOAD_FEATURE.md`
5. Read: `GUIDES/FEATURES/DELETE_COMPLAINTS_FEATURE.md`

### Path 4: I'm Experienced
1. Read: `GUIDES/SUMMARY/PROJECT_OVERVIEW.md`
2. Run: `npm install && npm run dev`
3. Test the application
4. Deploy when ready

---

## 📋 System Requirements

### Minimum
- Windows 7+, Mac OS 10.12+, or Linux
- 2GB RAM
- 500MB disk space
- Internet connection

### Recommended
- Windows 10+, Mac OS 11+, or Linux
- 4GB RAM
- 1GB disk space
- High-speed internet

---

## 🔧 What You Need to Install

1. **Node.js** (includes npm)
   - Download: https://nodejs.org/
   - Version: 14.0 or higher

2. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud)

3. **Text Editor** (optional)
   - VS Code: https://code.visualstudio.com/
   - Sublime Text: https://www.sublimetext.com/

---

## 🎓 Key Concepts

### User Roles
- **Student**: Submit complaints, view own complaints
- **Teacher**: Submit complaints, view own complaints
- **Admin**: Manage branch complaints, respond, delete
- **Principal**: System-wide access, see all identities

### Complaint Status
- **Pending**: Just submitted
- **In Progress**: Being reviewed
- **Resolved**: Completed

### Features
- Anonymous complaints
- Photo/video upload
- Real-time status tracking
- Admin responses
- Analytics dashboard

---

## 🧪 Test Accounts

After setup, use these to test:

```
Student:
  Email: student@test.com
  Password: test123

Admin:
  Email: admin@test.com
  Password: test123

Principal:
  Email: principal@test.com
  Password: test123
```

---

## 📊 Project Structure

```
ProjectSafetyHub/
├── app/
│   ├── api/                    (Backend API)
│   ├── page.js                 (Frontend UI)
│   └── layout.js               (Layout)
├── components/
│   └── ui/                     (UI Components)
├── GUIDES/                     (Documentation)
│   ├── SUMMARY/                (Overview)
│   ├── STEPS/                  (Step-by-step)
│   ├── DEPLOYMENT/             (Deployment)
│   └── FEATURES/               (Features)
├── .env.local                  (Configuration)
├── package.json                (Dependencies)
└── next.config.js              (Next.js config)
```

---

## ⚡ Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Start MongoDB
mongod

# Connect to MongoDB
mongosh
```

---

## 🆘 Need Help?

### Installation Issues
→ Read: `GUIDES/STEPS/INSTALLATION_STEPS.md`

### Setup Issues
→ Read: `GUIDES/STEPS/SETUP_STEPS.md`

### Testing Issues
→ Read: `GUIDES/STEPS/TESTING_STEPS.md`

### Deployment Issues
→ Read: `GUIDES/STEPS/DEPLOYMENT_STEPS.md`

### Feature Questions
→ Read: `GUIDES/FEATURES/`

### General Questions
→ Read: `GUIDES/SUMMARY/PROJECT_OVERVIEW.md`

---

## ✅ Checklist

Before you start, make sure you have:

- [ ] Node.js installed
- [ ] MongoDB installed
- [ ] Project folder opened
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file configured
- [ ] MongoDB running (`mongod`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened (http://localhost:3000)

---

## 🎯 Next Steps

1. **Choose your path** (see above)
2. **Follow the guides** in order
3. **Test the application**
4. **Deploy when ready**

---

## 💡 Tips

- **Keep terminals open**: Don't close MongoDB or dev server
- **Use separate terminals**: One for MongoDB, one for dev server
- **Check ports**: Make sure 3000 and 27017 are available
- **Read guides**: They have detailed troubleshooting

---

## 🚀 You're Ready!

Everything is set up and ready to go. Start with the guide for your path above!

**Happy coding!** 💻

---

**Status**: ✅ Getting Started Guide Complete  
**Version**: 1.0.0  
**Last Updated**: March 15, 2026
