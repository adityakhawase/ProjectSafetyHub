# Quick Start - 5 Minutes to Running SafetyHub

## Prerequisites Check
- [ ] Node.js installed? (`node --version`)
- [ ] MongoDB running? (`mongosh` or `mongo`)
- [ ] In project directory?

## 5-Step Quick Start

### 1. Install Dependencies (2 min)
```bash
npm install
```

### 2. Verify Environment File
The `.env.local` file is already created. Verify it exists in the project root.

### 3. Start Development Server (1 min)
```bash
npm run dev
```

### 4. Open Browser (1 min)
Navigate to: **http://localhost:3000**

### 5. Test Login (1 min)
- Click any role (Student/Teacher/Admin/Principal)
- Click "Register" to create a test account
- Fill in the form and submit
- You're in!

---

## Test Credentials (Pre-created)

If you want to skip registration, use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | test123 |
| Teacher | teacher@test.com | test123 |
| Admin | admin@test.com | test123 |
| Principal | principal@test.com | test123 |

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| "Cannot connect to MongoDB" | Start MongoDB: `mongod` (Windows) or `brew services start mongodb-community` (Mac) |
| "Port 3000 in use" | Change port in package.json or kill process: `lsof -ti:3000 \| xargs kill -9` |
| "Module not found" | Run `npm install` again |
| "Blank page" | Check browser console (F12) for errors |

---

## What's Included

✅ Complete authentication system (4 roles)
✅ Complaint management system
✅ Role-based dashboards
✅ Analytics & statistics
✅ MongoDB integration
✅ Responsive UI (mobile-friendly)
✅ Production-ready code

---

## Next Steps

1. **Explore the app** - Try different roles and features
2. **Read DEPLOYMENT_GUIDE.md** - For detailed setup instructions
3. **Check API endpoints** - See `app/api/[[...path]]/route.js`
4. **Customize** - Modify branches, categories, or UI as needed
5. **Deploy** - Follow production deployment steps in DEPLOYMENT_GUIDE.md

---

## Useful Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run dev:no-reload    # Dev without hot reload
```

---

**Ready to go!** 🚀
