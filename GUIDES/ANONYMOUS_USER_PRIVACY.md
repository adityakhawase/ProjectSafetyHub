# Anonymous User Privacy Implementation

## Overview
Anonymous user identities are now protected and only visible to authorized personnel (Admin and Principal roles).

## Changes Made

### Backend API (`app/api/[[...path]]/route.js`)

#### 1. **GET /api/complaints** - List all complaints
- **Before**: All users could see anonymous user details (studentName, studentEmail, studentId)
- **After**: 
  - Admin and Principal: See full details including anonymous user identity
  - Students and Teachers: See "Anonymous" for studentName, null for studentEmail and studentId
  - Implementation: Maps through results and masks sensitive fields for non-admin/principal users

#### 2. **GET /api/complaints/{id}** - Get single complaint
- **Before**: All users could see anonymous user details
- **After**:
  - Admin and Principal: See full details including anonymous user identity
  - Students and Teachers: See "Anonymous" for studentName, null for studentEmail and studentId
  - Implementation: Checks user role before returning complaint data

#### 3. **GET /api/analytics/stats** - Analytics dashboard
- **Before**: No changes needed (only counts, no personal data exposed)
- **After**: Maintains existing behavior - counts anonymous vs non-anonymous submissions separately

## Access Control Rules

| Role | Can See Anonymous Identity? | Details |
|------|---------------------------|---------|
| **Admin** | ✅ Yes | Can see all anonymous complaints in their branch |
| **Principal** | ✅ Yes | Can see all anonymous complaints across all branches |
| **Student** | ❌ No | Only sees "Anonymous" for other students' anonymous complaints |
| **Teacher** | ❌ No | Only sees "Anonymous" for other teachers' anonymous complaints |

## Data Masking Logic

When a complaint is marked as `isAnonymous: true`:

```javascript
// For non-admin/principal users:
{
  ...complaint,
  studentName: 'Anonymous',
  studentEmail: null,
  studentId: null
}

// For admin/principal users:
{
  ...complaint,
  studentName: 'Original Name',
  studentEmail: 'original@email.com',
  studentId: 'uuid-of-student'
}
```

## Security Benefits

1. **Privacy Protection**: Anonymous complaints remain truly anonymous to other students/teachers
2. **Accountability**: Admin and Principal can identify anonymous complainants if needed
3. **Trust**: Students can file complaints without fear of identification by peers
4. **Transparency**: Authorized personnel maintain oversight capability

## Testing Recommendations

1. **Student Login**: Submit anonymous complaint, verify you see "Anonymous" when viewing it
2. **Admin Login**: View same complaint, verify you see the actual student name
3. **Principal Login**: View same complaint, verify you see the actual student name
4. **Teacher Login**: Submit anonymous complaint, verify other teachers see "Anonymous"

## Database Schema Note

The database stores the actual identity in all cases:
- `studentName`: Actual name (or "Anonymous" if keepAnonymous was true)
- `studentEmail`: Actual email
- `studentId`: Actual user ID
- `isAnonymous`: Boolean flag indicating if complaint was submitted anonymously

The masking happens at the API response level, not in the database.
