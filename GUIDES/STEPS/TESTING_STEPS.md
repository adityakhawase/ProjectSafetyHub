# Testing Steps - SafetyHub

**Time Required**: 20-30 minutes  
**Difficulty**: Easy

---

## 📋 Prerequisites

Before testing, make sure:
- ✅ MongoDB is running
- ✅ Dev server is running
- ✅ Application is open at http://localhost:3000

---

## Test 1: Student Account Creation & Login (5 minutes)

### Step 1: Go to Home Page
1. Open http://localhost:3000
2. You should see SafetyHub home page

### Step 2: Create Student Account
1. Click **"Student Login"** button
2. Click **"Don't have an account? Register"**
3. Fill the form:
   - **Name**: John Student
   - **Email**: student@test.com
   - **Password**: test123
   - **Branch**: COMPUTER SCIENCE
4. Click **"Create Account"**

### Step 3: Verify Login
- ✅ Should see Student Dashboard
- ✅ Should show "Welcome, John Student"
- ✅ Should show branch: COMPUTER SCIENCE

---

## Test 2: Submit Complaint (5 minutes)

### Step 1: Click "Submit Complaint"
- You should see the complaint form

### Step 2: Fill Complaint Form
- **Title**: Test Complaint
- **Description**: This is a test complaint to verify the system
- **Category**: Bullying
- **Branch**: COMPUTER SCIENCE

### Step 3: Upload Media (Required for Bullying)
1. Click on the media upload area
2. Select a photo or video from your computer
3. Should see preview of the media

### Step 4: Submit
1. Click **"Submit Complaint"**
2. Should see success message: "Complaint submitted successfully!"

### Step 5: Verify
- ✅ Complaint appears in "My Complaints" list
- ✅ Shows title, category, branch
- ✅ Shows status: "pending"
- ✅ Shows media preview

---

## Test 3: Anonymous Complaint (5 minutes)

### Step 1: Create Another Complaint
1. Click **"Submit Complaint"** again
2. Fill form:
   - **Title**: Anonymous Test
   - **Description**: Testing anonymous feature
   - **Category**: Harassment
   - **Branch**: COMPUTER SCIENCE

### Step 2: Check Anonymous Box
1. Check **"Keep my identity anonymous"**
2. Upload media (optional for Harassment)
3. Click **"Submit Complaint"**

### Step 3: Verify
- ✅ Complaint submitted successfully
- ✅ Shows "Anonymous" badge
- ✅ Student name shows as "Anonymous"

---

## Test 4: Admin Account & Response (5 minutes)

### Step 1: Logout
1. Click **"Logout"** button
2. Should return to home page

### Step 2: Create Admin Account
1. Click **"Admin Login"**
2. Click **"Request account registration"**
3. Fill form:
   - **Name**: Admin User
   - **Email**: admin@test.com
   - **Password**: test123
   - **Branch**: COMPUTER SCIENCE
4. Click **"Create Account"**

### Step 3: Verify Admin Dashboard
- ✅ Should see "Admin Dashboard"
- ✅ Should show both complaints submitted
- ✅ Should show student name for first complaint
- ✅ Should show "Anonymous" for second complaint

### Step 4: Respond to Complaint
1. Click on first complaint (Test Complaint)
2. In the dialog:
   - **Update Status**: Select "In Progress"
   - **Add Response**: Type "We are looking into this"
3. Click **"Update Complaint"**

### Step 5: Verify Response
- ✅ Status changed to "In Progress"
- ✅ Response appears in complaint
- ✅ Shows admin name and timestamp

---

## Test 5: Principal Account (5 minutes)

### Step 1: Logout
1. Click **"Logout"**
2. Return to home page

### Step 2: Create Principal Account
1. Click **"Principal Login"**
2. Click **"Request account registration"**
3. Fill form:
   - **Name**: Dr. Principal
   - **Email**: principal@test.com
   - **Password**: test123
4. Click **"Create Account"**

### Step 3: Verify Principal Dashboard
- ✅ Should see "Principal Dashboard"
- ✅ Should see "System-Wide Access" badge
- ✅ Should see both complaints
- ✅ Should see student name for first complaint
- ✅ Should see "Anonymous" for second complaint

### Step 4: Delete Complaint
1. Click on second complaint (Anonymous Test)
2. Click **"Delete Complaint"** button
3. Confirm deletion
4. Should see success message

### Step 5: Verify Deletion
- ✅ Complaint removed from list
- ✅ Only one complaint remains

---

## Test 6: Analytics Dashboard (3 minutes)

### Step 1: View Analytics
1. Click on "Total Complaints" card
2. Should see Analytics Dashboard

### Step 2: Verify Statistics
- ✅ Total Complaints: 1 (one was deleted)
- ✅ Total Resolved: 0
- ✅ Pending: 0
- ✅ In Progress: 1
- ✅ Branch-wise stats shown
- ✅ Category-wise stats shown

---

## Test 7: Media Upload Validation (3 minutes)

### Step 1: Test Required Media
1. Logout and login as student
2. Try to submit Bullying complaint without media
3. Should see error: "Media (photo/video) is required for Bullying complaints"

### Step 2: Test Optional Media
1. Submit Harassment complaint without media
2. Should submit successfully (media optional)

### Step 3: Test File Size
1. Try to upload file larger than 50MB
2. Should see error: "File too large. Maximum size: 50MB"

---

## Test 8: Branch Selection (2 minutes)

### Step 1: Create Complaint
1. Login as student
2. Click "Submit Complaint"
3. Try to submit without selecting branch
4. Should show error: "Branch is required"

### Step 2: Verify Branch Selection
- ✅ Must explicitly select branch
- ✅ No pre-filled branch

---

## Test 9: Account Limits (2 minutes)

### Step 1: Test Admin Limit
1. Try to create 17th admin account
2. Should see error: "Maximum 16 admin accounts allowed"

### Step 2: Test Principal Limit
1. Try to create 4th principal account
2. Should see error: "Maximum 3 principal accounts allowed"

---

## Test 10: Role-Based Access (2 minutes)

### Step 1: Student Access
- ✅ Can submit complaints
- ✅ Can view own complaints
- ✅ Cannot see other students' complaints
- ✅ Cannot delete complaints

### Step 2: Admin Access
- ✅ Can view branch complaints
- ✅ Can respond to complaints
- ✅ Can delete branch complaints
- ✅ Cannot see other branches

### Step 3: Principal Access
- ✅ Can view all complaints
- ✅ Can respond to complaints
- ✅ Can delete any complaint
- ✅ Can see anonymous identities

---

## ✅ All Tests Complete!

If all tests passed, your SafetyHub system is working correctly!

---

## 📊 Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Student Account | ✅ | Account created and logged in |
| Submit Complaint | ✅ | Complaint submitted with media |
| Anonymous Complaint | ✅ | Anonymous badge displayed |
| Admin Response | ✅ | Status updated and response added |
| Principal Access | ✅ | System-wide access verified |
| Delete Complaint | ✅ | Complaint deleted successfully |
| Analytics | ✅ | Statistics displayed correctly |
| Media Validation | ✅ | File validation working |
| Branch Selection | ✅ | Branch required and selected |
| Account Limits | ✅ | Limits enforced correctly |
| Role-Based Access | ✅ | Permissions working correctly |

---

## 🐛 If Tests Fail

### Complaint Not Submitting
- Check browser console (F12) for errors
- Check terminal for error messages
- Verify MongoDB is running
- Verify all fields are filled

### Media Not Uploading
- Check file format (JPEG, PNG, GIF, MP4, WebM, MOV)
- Check file size (max 50MB)
- Check browser console for errors

### Admin Can't See Complaints
- Verify admin branch matches complaint branch
- Verify admin is logged in
- Refresh page

### Anonymous Not Working
- Check "Keep my identity anonymous" checkbox
- Verify complaint submitted
- Login as admin/principal to see identity

---

## 📝 Next Steps

After testing is complete:
1. Read: `GUIDES/DEPLOYMENT/DEPLOYMENT_GUIDE.md`
2. Prepare for production deployment
3. Configure production environment

---

**Status**: ✅ Testing Guide Complete
