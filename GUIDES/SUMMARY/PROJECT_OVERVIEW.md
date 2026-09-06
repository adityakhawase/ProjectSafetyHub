# SafetyHub - Project Overview

**Project Name**: SafetyHub - Student Safety & Complaint Management System  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: March 15, 2026

---

## 🎯 What is SafetyHub?

SafetyHub is a comprehensive web-based complaint management system designed for educational institutions. It allows students, teachers, admins, and principals to submit, track, and manage complaints in a secure and organized manner.

---

## 📊 Key Features

### For Students & Teachers
- ✅ Submit complaints anonymously or with identity
- ✅ Upload photos/videos as evidence
- ✅ Track complaint status in real-time
- ✅ View admin responses
- ✅ View analytics dashboard

### For Admins
- ✅ Manage complaints from their branch
- ✅ Respond to complaints
- ✅ Update complaint status
- ✅ Delete inappropriate complaints
- ✅ View branch-level analytics

### For Principals
- ✅ System-wide access to all complaints
- ✅ See anonymous user identities
- ✅ Manage all complaints
- ✅ View system-wide analytics
- ✅ Delete any complaint

---

## 🏗️ Technology Stack

### Frontend
- React 18
- Next.js 16
- Tailwind CSS
- Radix UI Components
- Lucide React Icons

### Backend
- Node.js
- Next.js API Routes
- MongoDB
- JWT Authentication
- bcryptjs Password Hashing

### Database
- MongoDB (Local or Atlas)
- Collections: users, complaints

---

## 🔐 Security Features

- ✅ JWT Authentication (7-day expiration)
- ✅ Password Hashing (bcryptjs)
- ✅ Role-Based Access Control (RBAC)
- ✅ Branch-Level Isolation
- ✅ Anonymous Identity Masking
- ✅ File Type & Size Validation
- ✅ Database Indexes

---

## 👥 User Roles

### Student
- Submit complaints
- View own complaints
- Upload media (optional)
- Keep anonymous
- View analytics

### Teacher
- Submit complaints
- View own complaints
- Upload media (optional)
- Keep anonymous
- View analytics

### Admin
- View branch complaints
- Respond to complaints
- Update status
- Delete complaints (branch only)
- View branch analytics
- **Limit**: 16 accounts max

### Principal
- View all complaints (system-wide)
- Respond to complaints
- Update status
- Delete any complaint
- See anonymous identities
- View system-wide analytics
- **Limit**: 3 accounts max

---

## 📁 Project Structure

```
ProjectSafetyHub/
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          (API endpoints)
│   ├── page.js                   (Frontend UI)
│   ├── layout.js                 (Layout)
│   └── globals.css               (Styles)
├── components/
│   └── ui/                       (UI components)
├── lib/
│   └── utils.js                  (Utilities)
├── GUIDES/                       (Documentation)
│   ├── SUMMARY/                  (Overview docs)
│   ├── STEPS/                    (Step-by-step guides)
│   ├── DEPLOYMENT/               (Deployment guides)
│   └── FEATURES/                 (Feature docs)
├── .env.local                    (Environment variables)
├── package.json                  (Dependencies)
├── next.config.js                (Next.js config)
└── jsconfig.json                 (JS config)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
mongod
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:3000
```

---

## 📊 Complaint Categories

1. Harassment
2. Bullying (requires media)
3. Ragging (requires media)
4. Safety Concern
5. Infrastructure Issue (requires media, auto-resolved)
6. Hostel Issue
7. Medical Emergency
8. Other

---

## 🏢 Branches

1. AIML
2. COMPUTER SCIENCE
3. MECHANICAL ENGINEERING
4. CIVIL ENGINEERING
5. ELECTRONICS AND TELECOMMUNICATION
6. ELECTRICAL ENGINEERING
7. STAFF

---

## 📈 Complaint Status Flow

```
pending → in-progress → resolved
```

**Special**: Infrastructure Issue complaints are auto-resolved with system auto-reply.

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  id: UUID,
  email: String (unique),
  password: String (hashed),
  name: String,
  branch: String,
  role: String,
  createdAt: ISO Date
}
```

### Complaints Collection
```javascript
{
  id: UUID,
  title: String,
  description: String,
  category: String,
  branch: String,
  status: String,
  isAnonymous: Boolean,
  studentId: UUID,
  studentName: String,
  studentEmail: String,
  media: {
    id: UUID,
    base64: String,
    type: String,
    uploadedAt: ISO Date
  },
  responses: [{
    id: UUID,
    adminId: UUID,
    adminName: String,
    message: String,
    timestamp: ISO Date
  }],
  createdAt: ISO Date,
  updatedAt: ISO Date
}
```

---

## 📚 Documentation Structure

### GUIDES/SUMMARY/
- `PROJECT_OVERVIEW.md` (This file)
- `FEATURES_SUMMARY.md`
- `ARCHITECTURE_OVERVIEW.md`

### GUIDES/STEPS/
- `INSTALLATION_STEPS.md`
- `SETUP_STEPS.md`
- `TESTING_STEPS.md`
- `DEPLOYMENT_STEPS.md`

### GUIDES/DEPLOYMENT/
- `DEPLOYMENT_GUIDE.md`
- `DETAILED_DEPLOYMENT_STEPS.md`
- `PRODUCTION_CHECKLIST.md`

### GUIDES/FEATURES/
- `ANONYMOUS_USER_PRIVACY.md`
- `MEDIA_UPLOAD_FEATURE.md`
- `DELETE_COMPLAINTS_FEATURE.md`

---

## 🎯 Next Steps

1. **Read**: `GUIDES/STEPS/INSTALLATION_STEPS.md`
2. **Setup**: `GUIDES/STEPS/SETUP_STEPS.md`
3. **Test**: `GUIDES/STEPS/TESTING_STEPS.md`
4. **Deploy**: `GUIDES/DEPLOYMENT/DEPLOYMENT_GUIDE.md`

---

## 📞 Support

For detailed information, check the appropriate guide:
- Installation issues → `GUIDES/STEPS/INSTALLATION_STEPS.md`
- Feature questions → `GUIDES/FEATURES/`
- Deployment help → `GUIDES/DEPLOYMENT/`
- General overview → `GUIDES/SUMMARY/`

---

**Status**: 🟢 **FULLY OPERATIONAL**  
**Version**: 1.0.0  
**Ready for Deployment**: ✅ YES
