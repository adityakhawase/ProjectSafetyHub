# SafetyHub - Complete Project Logic & Architecture

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Core Features](#core-features)
5. [Data Flow](#data-flow)
6. [Frontend Logic](#frontend-logic)
7. [Backend API Endpoints](#backend-api-endpoints)
8. [Database Schema](#database-schema)
9. [Authentication & Security](#authentication--security)
10. [Feature Implementations](#feature-implementations)

---

## Project Overview

**SafetyHub** is a Student Safety & Complaint Management System designed to provide a secure platform where students, teachers, and administrators can report and manage complaints related to safety issues.

### Key Objectives:
- Enable students/teachers to report safety complaints anonymously or with identity
- Allow admins and principals to manage and respond to complaints
- Track complaint status and resolution
- Support media uploads (photos/videos) for evidence
- Provide role-based access control
- Maintain privacy and security

---

## System Architecture

### Tech Stack:
- **Frontend:** Next.js (React) with Tailwind CSS
- **Backend:** Node.js API (Next.js API Routes)
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **UI Components:** shadcn/ui

### Project Structure:
```
SafetyHub/
├── app/
│   ├── api/[[...path]]/route.js       # All API endpoints
│   ├── page.js                         # Main frontend component
│   ├── layout.js                       # App layout
│   └── globals.css                     # Global styles & animations
├── components/ui/                      # UI component library
├── public/                             # Static assets
└── package.json                        # Dependencies
```

---

## User Roles & Permissions

### 1. **Student**
- **Permissions:**
  - Create complaints (anonymous or identified)
  - View own complaints and their status
  - Track complaint responses
  - Upload media (photos/videos)
  - Cannot delete or modify complaints
  - Cannot see other students' complaints

### 2. **Teacher**
- **Permissions:**
  - Same as Student (create, view, track complaints)
  - Can report issues from their branch
  - Cannot manage other users' complaints

### 3. **Admin**
- **Permissions:**
  - View all complaints from their assigned branch
  - Respond to complaints
  - Update complaint status (pending → in-progress → resolved)
  - Delete inappropriate/spam complaints
  - Cannot access complaints from other branches
  - Account limit: 16 accounts max

### 4. **Principal**
- **Permissions:**
  - View all complaints from all branches
  - Respond to complaints
  - Update complaint status
  - Delete inappropriate/spam complaints
  - Full system access
  - Account limit: 3 accounts max

---

## Core Features

### 1. **Authentication System**
- User registration with role selection
- Email & password-based login
- JWT token generation and validation
- Token stored in localStorage
- Session persistence

### 2. **Complaint Management**
- Create complaints with:
  - Title
  - Description
  - Category (Bullying, Ragging, Infrastructure Issue, etc.)
  - Branch selection
  - Anonymous option
  - Media upload (optional/required based on category)
- View complaint status (Pending, In-Progress, Resolved)
- Track responses from admins/principals

### 3. **Media Upload**
- Supported formats: JPEG, PNG, GIF, MP4, WebM, MOV
- Max file size: 50MB
- Base64 encoding for storage
- Media preview in complaint view
- Required for: Bullying, Ragging, Infrastructure Issue
- Optional for: Other categories

### 4. **Anonymous Privacy**
- Students can choose to keep identity anonymous
- Actual name stored in database
- API masks name to "Anonymous" for non-admin/principal users
- Only admin and principal see real identity
- Other users see "Anonymous" badge

### 5. **Complaint Response System**
- Admins/Principals can respond to complaints
- Update complaint status
- Add response messages
- Track response timestamp and responder name

### 6. **Delete Functionality**
- Admin: Can delete complaints from their branch only
- Principal: Can delete complaints from any branch
- Confirmation dialog before deletion
- Prevents accidental deletion

### 7. **Analytics Dashboard**
- Total complaints submitted
- Total complaints resolved
- Complaints by status (Pending, In-Progress, Resolved)
- Branch-wise statistics
- Resolution rate calculation

---

## Data Flow

### User Registration Flow:
```
1. User selects role (Student/Teacher/Admin/Principal)
2. Fills registration form (name, email, password, branch)
3. Frontend validates input
4. POST /api/auth/register
5. Backend checks account limits
6. Backend hashes password
7. Creates user in database
8. Returns JWT token
9. Frontend stores token & user data in localStorage
10. Redirects to dashboard
```

### Complaint Submission Flow:
```
1. User fills complaint form
2. Selects category, branch, adds title & description
3. Optionally uploads media
4. Frontend converts media to Base64
5. POST /api/complaints with JWT token
6. Backend validates token & user
7. Stores complaint in database
8. Returns success response
9. Frontend refreshes complaint list
10. Shows success message
```

### Complaint Response Flow:
```
1. Admin/Principal views complaint
2. Clicks "Respond" button
3. Fills response form with message & status
4. PATCH /api/complaints/{id} with JWT token
5. Backend validates permissions
6. Updates complaint status & adds response
7. Returns updated complaint
8. Frontend refreshes complaint list
9. Shows updated status
```

### Anonymous Privacy Flow:
```
1. Student submits complaint with anonymous flag
2. Backend stores actual name in database
3. GET /api/complaints (for non-admin/principal)
4. Backend masks studentName to "Anonymous"
5. Frontend displays "Anonymous" badge
6. GET /api/complaints (for admin/principal)
7. Backend returns actual name
8. Admin/Principal sees real identity
```

---

## Frontend Logic

### Main Component States:
```javascript
- currentView: Current page (home, login, register, dashboards)
- selectedRole: Selected user role
- user: Current logged-in user data
- token: JWT authentication token
- complaints: List of complaints
- analytics: Analytics data
- complaintForm: Form state for new complaint
- responseForm: Form state for responding to complaint
- mediaFile: Selected media file
- mediaPreview: Media preview data
- showCreatorsModal: Modal visibility state
```

### Key Functions:

#### Authentication:
- `handleLogin()`: Authenticates user and stores token
- `handleRegister()`: Creates new user account
- `handleLogout()`: Clears token and user data

#### Complaint Management:
- `handleSubmitComplaint()`: Creates new complaint
- `handleUpdateComplaint()`: Updates complaint status/response
- `handleDeleteComplaint()`: Deletes complaint with confirmation
- `fetchComplaints()`: Retrieves user's complaints

#### Media Handling:
- `handleMediaChange()`: Validates and processes media file
- `removeMedia()`: Removes selected media
- Media validation: File type, size (max 50MB)

#### Data Fetching:
- `fetchBranches()`: Gets available branches
- `fetchCategories()`: Gets complaint categories
- `fetchAnalytics()`: Gets analytics data
- `fetchPublicStats()`: Gets public statistics

### View Components:

1. **Home Page**
   - Role selection cards
   - Public statistics display
   - Edge animations & wobbling shapes
   - Creators icon (fixed position)

2. **Login Page**
   - Email & password input
   - Role-specific login
   - Register link

3. **Registration Page**
   - Name, email, password input
   - Branch selection
   - Role-specific registration

4. **Student Dashboard**
   - New complaint form (sticky)
   - Complaint list with filters
   - Status badges
   - Response display
   - Media preview

5. **Admin Dashboard**
   - All branch complaints
   - Complaint details modal
   - Response form
   - Delete button
   - Status update

6. **Principal Dashboard**
   - All complaints (all branches)
   - Full complaint management
   - Delete functionality
   - Response system

7. **Teacher Dashboard**
   - Same as Student Dashboard
   - Can report issues

---

## Backend API Endpoints

### Authentication Endpoints:

#### POST /api/auth/register
```
Request: { email, password, name, branch, role }
Response: { token, user }
Logic:
- Validate input
- Check account limits (Admin: 16, Principal: 3)
- Hash password
- Create user in database
- Generate JWT token
```

#### POST /api/auth/login
```
Request: { email, password, role }
Response: { token, user }
Logic:
- Find user by email & role
- Verify password
- Generate JWT token
- Return user data
```

### Complaint Endpoints:

#### POST /api/complaints
```
Request: { title, description, category, branch, keepAnonymous, mediaBase64, mediaType }
Response: { complaint }
Logic:
- Validate JWT token
- Check media requirements
- Store complaint with user info
- If anonymous: store actual name, set display name to "Anonymous"
- Save media as Base64
- Return created complaint
```

#### GET /api/complaints
```
Response: { complaints }
Logic:
- Validate JWT token
- If Student/Teacher: return only their complaints
- If Admin: return complaints from their branch
- If Principal: return all complaints
- Mask names to "Anonymous" for non-admin/principal users
```

#### PATCH /api/complaints/{id}
```
Request: { response, status }
Response: { complaint }
Logic:
- Validate JWT token
- Check permissions (admin/principal only)
- Update complaint status
- Add response with timestamp
- Return updated complaint
```

#### DELETE /api/complaints/{id}
```
Response: { success }
Logic:
- Validate JWT token
- Check permissions
- If Admin: verify complaint is from their branch
- If Principal: allow deletion from any branch
- Delete complaint from database
- Return success
```

### Data Endpoints:

#### GET /api/branches
```
Response: { branches }
Logic: Return list of all branches
```

#### GET /api/categories
```
Response: { categories }
Logic: Return list of complaint categories
```

#### GET /api/public/stats
```
Response: { total, resolved, byBranch }
Logic: Return public statistics (no auth required)
```

#### GET /api/analytics/stats
```
Response: { overview, byCategory, byStatus }
Logic:
- Validate JWT token
- Return analytics based on user role
```

---

## Database Schema

### User Collection:
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (student/teacher/admin/principal),
  branch: String,
  createdAt: Date
}
```

### Complaint Collection:
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (reference to User),
  studentName: String (actual name),
  studentEmail: String,
  title: String,
  description: String,
  category: String,
  branch: String,
  status: String (pending/in-progress/resolved),
  keepAnonymous: Boolean,
  media: {
    base64: String,
    type: String,
    uploadedAt: Date
  },
  responses: [
    {
      id: ObjectId,
      adminId: ObjectId,
      adminName: String,
      message: String,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Security

### JWT Token Flow:
1. User logs in → Backend generates JWT token
2. Token stored in localStorage
3. Token sent in Authorization header for protected routes
4. Backend verifies token signature
5. Token contains user ID and role
6. Token expires after set duration

### Password Security:
- Passwords hashed using bcrypt
- Never stored in plain text
- Compared during login

### Role-Based Access Control:
- Each endpoint checks user role
- Admin can only access their branch data
- Principal can access all data
- Students can only see their own complaints

### Data Privacy:
- Anonymous complaints mask identity
- Only admin/principal see real names
- Other users see "Anonymous"
- Media stored as Base64 in database

---

## Feature Implementations

### 1. Anonymous Complaint System
**Logic:**
- User checks "Keep Anonymous" checkbox
- Frontend sends `keepAnonymous: true`
- Backend stores actual name in database
- When returning complaints to non-admin/principal:
  - Replace `studentName` with "Anonymous"
  - Add "Anonymous" badge to UI
- Admin/Principal see actual name

### 2. Media Upload
**Logic:**
- User selects file
- Frontend validates: type, size
- Converts to Base64 using FileReader
- Sends Base64 string to backend
- Backend stores in complaint document
- Frontend displays preview (image or video)
- Can remove media before submission

### 3. Complaint Status Tracking
**Logic:**
- Initial status: "pending"
- Admin/Principal can update to:
  - "in-progress": Being investigated
  - "resolved": Issue resolved
- Status displayed with color-coded badges
- Timeline shows status changes

### 4. Delete Functionality
**Logic:**
- Admin: Can delete from their branch only
- Principal: Can delete from any branch
- Confirmation dialog prevents accidents
- Deleted complaint removed from database
- Analytics updated

### 5. Analytics Dashboard
**Logic:**
- Count total complaints
- Count resolved complaints
- Group by status
- Group by branch
- Calculate resolution rate: (resolved / total) * 100
- Display in cards and charts

### 6. Edge Animations
**Logic:**
- Fixed position shapes at page edges
- Wobble animation (up/down movement)
- Opacity changes (0.3 to 0.45)
- Staggered animation delays
- 6 different shapes (circle, square, triangle, star, hexagon, diamond)
- Semi-transparent colors

### 7. Creators Icon
**Logic:**
- Fixed position (bottom-right)
- Shows people emoji
- Hover displays creator names
- Click opens modal with creator details
- Only on home and public analytics pages
- Pop-out animation on hover

---

## User Journey Examples

### Student Complaint Journey:
```
1. Student visits home page
2. Clicks "Student Login"
3. Enters email & password
4. Redirected to Student Dashboard
5. Fills complaint form
6. Optionally uploads media
7. Checks "Keep Anonymous" if desired
8. Submits complaint
9. Sees complaint in list with "pending" status
10. Waits for admin response
11. Sees admin response in complaint details
12. Tracks status changes
```

### Admin Management Journey:
```
1. Admin logs in
2. Sees all complaints from their branch
3. Clicks on complaint to view details
4. Reads complaint & sees media
5. Writes response message
6. Updates status to "in-progress"
7. Submits response
8. Complaint updated with response
9. Can delete if spam/inappropriate
10. Sees analytics of all complaints
```

### Principal Overview Journey:
```
1. Principal logs in
2. Sees all complaints from all branches
3. Can view any complaint
4. Can respond to any complaint
5. Can delete any complaint
6. Sees branch-wise analytics
7. Monitors overall system health
8. Tracks resolution rates
```

---

## Key Business Logic

### Account Limits:
- Admin: Maximum 16 accounts
- Principal: Maximum 3 accounts
- Enforced during registration

### Media Requirements:
- Required for: Bullying, Ragging, Infrastructure Issue
- Optional for: Other categories
- Validation prevents submission without required media

### Privacy Rules:
- Anonymous complaints hide identity from regular users
- Admin/Principal always see real identity
- "Anonymous" badge shown to other users

### Permission Hierarchy:
- Student/Teacher: Can only manage own complaints
- Admin: Can manage branch complaints
- Principal: Can manage all complaints

---

## Conclusion

SafetyHub is a comprehensive complaint management system that prioritizes:
- **Security:** JWT authentication, password hashing, role-based access
- **Privacy:** Anonymous complaint options, identity masking
- **Usability:** Intuitive dashboards, clear status tracking
- **Functionality:** Media uploads, response system, analytics
- **Scalability:** Modular architecture, database-driven

The system enables safe reporting of safety issues while maintaining appropriate access controls and privacy protections for all users.
