# SafetyHub - Project Context for AI

## Overview

SafetyHub is a **Campus Complaint Management System** — a single-page application built with Next.js 14 (App Router) and MongoDB. Students, teachers, admins, and principals can submit, track, and manage safety/complaint reports on campus.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Language** | JavaScript (JSX) — no TypeScript |
| **UI Components** | shadcn/ui (Radix UI primitives), 50+ components under `components/ui/` |
| **CSS** | Tailwind CSS 3 + `tailwindcss-animate` + `clsx`/`tailwind-merge` (`cn()` utility) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Form** | react-hook-form + zod (available but `page.js` uses manual state forms) |
| **Database** | MongoDB (native driver `mongodb@^6`) |
| **Auth** | JWT (`jsonwebtoken`) + bcryptjs |
| **Package Mgr** | Yarn v1 |

## Project Structure

```
/
├── app/
│   ├── page.js          ← SINGLE FILE SPA — all UI code (~3060 lines)
│   └── api/
│       └── [[...path]]/
│           └── route.js ← Catch-all API route (~750 lines)
├── components/
│   └── ui/              ← 51 shadcn/ui components (.jsx)
├── lib/
│   └── utils.js         ← cn() utility
├── hooks/
│   ├── use-toast.js     ← Toast notification system
│   └── use-mobile.jsx   ← Mobile detection hook
├── public/
├── package.json
├── tailwind.config.js
├── jsconfig.json        ← @/ path aliases
├── next.config.js       ← Standalone output, CORS headers
├── postcss.config.js
├── components.json      ← shadcn/ui config
└── .env.local           ← MongoDB connection, JWT secret
```

## Critical Architecture: Single-File SPA

**`app/page.js`** is a `'use client'` component that manages ALL application state via React `useState`. There is no file-based routing — the `currentView` state variable controls which screen renders:

```
currentView values:
  'home'               → Landing page with stats + CTA
  'login'              → Unified auth page (Sign In tab)
  'register'           → Unified auth page (Sign Up tab)
  'student-dashboard'  → Student complaint management
  'teacher-dashboard'  → Teacher complaint management
  'admin-dashboard'    → Admin complaint management (branch-scoped)
  'principal-dashboard'→ Principal complaint management (all branches)
  'analytics'          → Full analytics view (role-based)
  'public-analytics'   → Public stats page
```

### Key State Variables (all in `page.js`)

| Variable | Type | Purpose |
|----------|------|---------|
| `currentView` | string | Current screen |
| `selectedRole` | string | `student\|teacher\|admin\|principal` |
| `user` | object | Logged-in user `{ id, email, name, role, branch }` |
| `token` | string | JWT token |
| `branches` | string[] | Branch list from API |
| `categories` | string[] | Category list from API |
| `complaints` | object[] | User's complaints |
| `analytics` | object | Analytics data |
| `publicStats` | object | Homepage public stats |
| `loading, error, success` | — | UI state |
| `loginForm` | object | `{ email, password }` |
| `registerForm` | object | `{ email, password, confirmPassword, name, branch, role, enrollmentNumber }` |
| `complaintForm` | object | `{ title, description, category, branch, keepAnonymous, enrollmentNumber }` |
| `authTab` | string | `login\|register` |
| `rememberMe` | boolean | Persist token to localStorage vs sessionStorage |
| `passwordStrength` | number | 0–100 |
| `showLoginPassword, showRegPassword, showConfirmPassword` | boolean | Password visibility toggles |

### Core Functions (in `page.js`)

```
handleLogin(e)        → POST /api/auth/login → store JWT → redirect to role dashboard
handleRegister(e)     → POST /api/auth/register → store JWT → redirect
handleSubmitComplaint → POST /api/complaints → with optional base64 media
handleUpdateComplaint → PATCH /api/complaints/{id}
handleDeleteComplaint → DELETE /api/complaints/{id} (with confirm)
handleLogout          → Clear tokens → redirect home
handleMediaChange     → Validate type (JPEG/PNG/GIF/MP4/MOV) + size (max 50MB) → preview
calculatePasswordStrength(password) → 0–100 score
validateRegistration(form) → Returns boolean, sets regErrors
getRelativeTime(ts)   → "X minutes ago" formatting
```

## API Endpoints (`app/api/[[...path]]/route.js`)

All endpoints handled by a single catch-all route. Database is MongoDB.

### GET (Public — No Auth)

| Route | Returns |
|-------|---------|
| `/api/branches` | `{ branches: [...] }` |
| `/api/categories` | `{ categories: [...] }` |
| `/api/public/stats` | `{ total, pending, inProgress, resolved, lastComplaintAt, byBranch }` |

### GET (Auth Required)

| Route | Role | Behavior |
|-------|------|----------|
| `/api/complaints` | All | Principal → all. Admin → own branch. Student/Teacher → own only. Anonymous identities masked for non-admin/principal |
| `/api/complaints/{id}` | All | Single complaint with access check |
| `/api/analytics/stats` | All | Role-based: overview, byBranch, byCategory, byType (student/anonymous) |

### POST

| Route | Auth | Body | Notes |
|-------|------|------|-------|
| `/api/auth/register` | No | `{ email, password, name, branch, role, enrollmentNumber }` | Validates strength (>=30/100), branch, max admin=16, max principal=3. Returns JWT |
| `/api/auth/login` | No | `{ email, password, role }` | Optional role mismatch check. Returns JWT |
| `/api/complaints` | Yes | `{ title, description, category, branch, keepAnonymous, enrollmentNumber, mediaBase64, mediaType }` | Media required for Bullying/Ragging/Infrastructure. Infrastructure auto-resolves with system reply |

### PATCH

| Route | Auth | Body | Notes |
|-------|------|------|-------|
| `/api/complaints/{id}` | Admin/Principal | `{ status, response }` | Admin restricted to own branch |

### DELETE

| Route | Auth | Notes |
|-------|------|-------|
| `/api/complaints/{id}` | Admin/Principal | Admin restricted to own branch |

## Database Schema

### Users Collection
```js
{
  id: String (UUID v4),
  email: String (unique),
  password: String (bcrypt, 10 rounds),
  name: String,
  branch: String (branch name or 'ALL' for principal/teacher),
  role: String ('student'|'teacher'|'admin'|'principal'),
  enrollmentNumber: String (students only),
  createdAt: String (ISO)
}
```

### Complaints Collection
```js
{
  id: String (UUID v4),
  title: String,
  description: String,
  category: String,
  branch: String (indexed),
  status: String ('pending'|'in-progress'|'resolved'),
  isAnonymous: Boolean,
  isAdminReport: Boolean,
  reportedTeacherName: String,
  adminId: String,
  adminName: String,
  studentId: String (indexed),
  studentName: String (or 'Anonymous'),
  studentEmail: String,
  submitterRole: String ('student'|'teacher'),
  media: { id, base64, type, uploadedAt } | null,
  responses: [{ id, adminId, adminName, message, timestamp }],
  createdAt: String (ISO),
  updatedAt: String (ISO)
}
```

## Constants

```js
BRANCHES = ['AIML', 'COMPUTER SCIENCE', 'MECHANICAL ENGINEERING', 'CIVIL ENGINEERING', 'ELECTRONICS AND TELECOMMUNICATION', 'ELECTRICAL ENGINEERING', 'STAFF']

COMPLAINT_CATEGORIES = ['Harassment', 'Bullying', 'Ragging', 'Safety Concern', 'Infrastructure Issue', 'Hostel Issue', 'Medical Emergency', 'Other']

MEDIA_REQUIRED_CATEGORIES = ['Bullying', 'Ragging', 'Infrastructure Issue']

MAX_ADMIN_ACCOUNTS = 16
MAX_PRINCIPAL_ACCOUNTS = 3
```

## Auth Flow

1. **Registration**: Client validates → POST to `/api/auth/register` → bcrypt hash (10 rounds) → store in MongoDB → return JWT `{ userId, email, role, branch }` (expires 7d)
2. **Login**: Client sends email + password + role → bcrypt.compare → return JWT
3. **Token Storage**: `localStorage` (if "Remember me") or `sessionStorage`
4. **Auth Check**: `useEffect` on mount reads stored token → validates → sets `user` state → redirects to role dashboard
5. **Protected API**: All complaint/analytics endpoints verify JWT from `Authorization: Bearer <token>` header

## UI Component Patterns

- All UI components from `components/ui/` are imported at the top of `page.js`
- Use `cn()` from `@/lib/utils` for conditional class merging (though `page.js` uses template literals predominantly)
- Tailwind classes are used directly — no CSS modules
- The existing code often uses dynamic Tailwind class construction (e.g., `` `bg-${c.gradient}` ``), which works because the classes exist in the build
- shadcn/ui components are configured for "new-york" style, JavaScript (no TSX), slate base color

## Role-Color Mapping

```js
student  → blue   (from-blue-600 to-blue-700)
teacher  → green  (from-green-600 to-emerald-700)
admin    → purple (from-purple-600 to-purple-700)
principal→ amber  (from-amber-500 to-orange-600)
```

## Key UI Sections (Home Page)

1. **Desktop sidebar**: Logo + "Register a Complaint" (gradient CTA) + "Sign In" + Settings + Stats + Team
2. **Mobile nav**: 5 tabs — Register (gradient), Sign In, Settings, Stats, Team
3. **Hero section**: Shield icon + tagline
4. **Live Complaint Tracker**: Centered flex row — Pending / In Progress / Resolved / Last Registered
5. **Stats row**: Three centered equal-size cards — Total Submitted / Register a Complaint / Total Resolved
6. **Settings modal**: Profile info, appearance themes, account management
7. **Creators modal**: Team member cards

## Environment Variables (`.env.local`)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

## Dev Commands

```bash
yarn dev        # Start dev server on 0.0.0.0:3000
yarn build      # Production build (standalone output)
yarn start      # Start production server
```

## Important Conventions

- **No TypeScript** — all files are `.js` / `.jsx`
- **Single file SPA** — `page.js` IS the app. All new UI features go there unless they are truly reusable components
- **Catch-all API** — `route.js` handles all endpoints via path parsing. New endpoints go there
- **Password strength**: min score 30/100 (validates length >=6, mixed case, digits, special chars)
- **Media validation**: JPEG/PNG/GIF/MP4/WebM/MOV, max 50MB, min 50KB for images, header validation
- **Account limits**: 16 admin max, 3 principal max
- **Auto-reply**: "Infrastructure Issue" complaints auto-resolve with system response
- **Anonymous submissions**: `isAnonymous` flag masks student name/email from non-admin viewers
