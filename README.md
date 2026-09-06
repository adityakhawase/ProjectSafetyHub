# SafetyHub - Student Safety & Complaint Management System

A comprehensive web application for managing student safety complaints in educational institutions with branch-specific admin access, principal oversight, and anonymous reporting capabilities.

## 🎯 Features

### For Students
- **Secure Registration & Login**: Students can create unlimited accounts with their college credentials
- **Submit Complaints**: File complaints with detailed descriptions and categorization
- **Anonymous Option**: Keep identity anonymous while logged in using "Keep Anonymous" checkbox
- **Track Status**: Real-time tracking of complaint status (Pending, In Progress, Resolved)
- **Receive Responses**: Get direct responses from admins and principals
- **Auto-Reply**: Automatic acknowledgment for Infrastructure Issue complaints
- **Analytics Dashboard**: View personal complaint statistics with clickable tiles for detailed insights

### For Admins (Max 15 Accounts)
- **Branch-Specific Access**: Admins only see complaints from their assigned branch
- **Complaint Management**: View, filter, and manage all branch complaints
- **Status Updates**: Change complaint status as they're being addressed
- **Response System**: Send messages and updates directly to students
- **Dashboard Analytics**: View branch-specific statistics with detailed breakdowns
- **Advanced Filters**: Filter by status, category, submission type, and branch

### For Principals (Max 4 Accounts)
- **System-Wide Access**: View and manage complaints from ALL branches
- **Cross-Branch Management**: Update and respond to any complaint regardless of branch
- **Complete Analytics**: System-wide statistics and insights
- **All Admin Features**: Full access to all complaint management features across the institution

### Security Features
- Password encryption using bcrypt
- JWT-based authentication with role validation
- Branch-specific data isolation for admins
- System-wide access control for principals
- Secure database storage with MongoDB
- Account creation limits (15 admins, 4 principals)

## 🏗️ Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **UI Components**: Radix UI, Lucide Icons

## 📋 Configuration

### Available Branches
- AIML
- Computer Science
- Mechanical Engineering
- Civil Engineering
- Electronics and Telecommunication
- Electrical Engineering

### Complaint Categories
- Harassment
- Bullying
- Ragging
- Safety Concern
- Infrastructure Issue (Auto-replied)
- Hostel Issue
- Medical Emergency
- Other

### User Roles & Limits
- **Student**: Unlimited accounts, can submit complaints
- **Admin**: Maximum 15 accounts, branch-specific access
- **Principal**: Maximum 4 accounts, system-wide access

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote)
- Yarn package manager

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables in `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=student_safety_db
NEXT_PUBLIC_BASE_URL=your-app-url
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the development server:
```bash
yarn dev
```

5. Access the application at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (student/admin/principal) with account limits
- `POST /api/auth/login` - Login user with role validation

### Complaints
- `GET /api/complaints` - Get user complaints (filtered by role)
- `POST /api/complaints` - Create new complaint (with keepAnonymous option)
- `GET /api/complaints/:id` - Get specific complaint
- `PATCH /api/complaints/:id` - Update complaint (admin/principal only)

### Analytics
- `GET /api/analytics/stats` - Get role-based analytics (overview, by branch, by category, by type)

### Utilities
- `GET /api/branches` - Get all available branches
- `GET /api/categories` - Get all complaint categories

## 🔐 User Roles

### Student
- Can register unlimited accounts
- Can submit complaints (logged in with optional anonymity)
- Can view their own complaints and analytics
- Can track complaint status and view responses
- Receives auto-reply for Infrastructure Issue complaints

### Admin (Max 15 Accounts)
- Can only register up to 15 accounts system-wide
- Can only view complaints from their assigned branch
- Can update complaint status
- Can send responses to students
- Has access to branch-specific analytics
- Cannot access complaints from other branches

### Principal (Max 4 Accounts)
- Can only register up to 4 accounts system-wide
- Can view ALL complaints from ALL branches
- Can update any complaint regardless of branch
- Can send responses to any student
- Has access to system-wide analytics
- Has complete oversight of the entire system

## 📊 Database Schema

### Users Collection
```javascript
{
  id: UUID,
  email: String,
  password: String (hashed),
  name: String,
  branch: String,
  role: String (student/admin/principal),
  createdAt: Date
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
  status: String (pending/in-progress/resolved),
  isAnonymous: Boolean (from keepAnonymous checkbox),
  studentId: UUID,
  studentName: String (shows "Anonymous" if keepAnonymous is true),
  studentEmail: String,
  responses: [{
    id: UUID,
    adminId: UUID (or 'system' for auto-reply),
    adminName: String,
    message: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Workflow

1. **Role Selection**: User selects Student/Admin/Principal from landing page
2. **Authentication**: User logs in or registers (with account limits enforced)
3. **Student Submits Complaint**: 
   - Student logs in and fills complaint form
   - Can check "Keep my identity anonymous" option
   - Auto-reply sent immediately for Infrastructure Issues
4. **Admin/Principal Receives**: Complaint appears in respective dashboard
   - Admin sees only their branch complaints
   - Principal sees all complaints system-wide
5. **Admin/Principal Responds**: Updates status and sends response to student
6. **Student Tracks**: Student sees status updates and responses
7. **Analytics View**: Users can click analytics tiles to view detailed breakdowns
   - By student/anonymous submissions
   - By branch
   - By category
8. **Complaint Resolved**: Admin/Principal marks complaint as resolved

## ✨ Key Features Explained

### Auto-Reply System
When a student submits a complaint with category "Infrastructure Issue", the system automatically adds a response:
> "Thank you for bringing this infrastructure issue to our attention. We understand the inconvenience it may have caused and sincerely apologize for the same. Our team has taken note of the concern and is currently reviewing the situation to identify the root cause. Necessary steps will be taken to resolve the issue at the earliest and ensure that such problems are minimized in the future. We appreciate your patience and cooperation while we work towards improving the infrastructure and maintaining a better experience for everyone. 👍 HAVE A GOOD DAY 😊"

### Analytics Dashboard
Accessible by clicking "Total Submitted" or "Total Resolved" tiles:
- **By Type**: Student submissions vs Anonymous submissions (counts only)
- **By Branch**: Complaints per branch with submitted/resolved counts
- **By Category**: Complaints per category with submitted/resolved counts
- **Role-based filtering**: 
  - Students see only their own stats
  - Admins see only their branch stats
  - Principals see system-wide stats

### Keep Anonymous Feature
- Students remain logged in but can choose to hide their identity
- Their complaint shows "Anonymous" as the name
- Admin responses still reach them via their account
- Complaint is still linked to their student ID in database

## 🚧 Future Enhancements

- Email notifications for complaint updates (placeholder ready)
- File/image upload for evidence
- Priority levels for complaints
- Department-wise complaint assignment within branches
- Export reports functionality (PDF/Excel)
- Multi-language support
- Mobile app version
- SMS notifications
- Complaint history timeline view
- Search functionality across complaints

## 📞 Support

For technical support or questions about the system, please contact your institution's IT department.

## 📄 License

This project is developed for educational institutions to manage student safety and complaints efficiently.

---

## 🎯 System Highlights

### Enhanced Features (v2.0)
✅ **Three-Role System**: Student, Admin, Principal with distinct access levels  
✅ **Auto-Reply System**: Instant acknowledgment for infrastructure complaints  
✅ **Analytics Dashboard**: Comprehensive statistics with detailed breakdowns  
✅ **Keep Anonymous**: Privacy option within authenticated submissions  
✅ **Account Limits**: Controlled admin (15) and principal (4) account creation  
✅ **Role Validation**: Secure login with role-specific authentication  
✅ **System-Wide Access**: Principal can oversee all branches  
✅ **Branch Isolation**: Admins restricted to their branch for data security  

**Note**: This system is designed to help educational institutions create a safer environment for students by providing an efficient complaint management system with proper oversight, transparency, and role-based access control.
