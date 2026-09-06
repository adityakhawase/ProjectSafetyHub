# Complete Email Notifications Setup Guide

## Table of Contents
1. [Install Dependencies](#step-1-install-dependencies)
2. [Gmail Setup (Easiest)](#step-2-gmail-setup)
3. [Configure Environment Variables](#step-3-configure-environment-variables)
4. [Test Email Sending](#step-4-test-email-sending)
5. [Troubleshooting](#troubleshooting)

---

## Step 1: Install Dependencies

### On Windows (Command Prompt or PowerShell):

```bash
npm install nodemailer
```

Or if using Yarn:
```bash
yarn add nodemailer
```

**Expected Output:**
```
added 6 packages, and audited 7 packages in 2s
```

### Verify Installation:
```bash
npm list nodemailer
```

You should see:
```
└── nodemailer@6.9.7
```

---

## Step 2: Gmail Setup (Recommended for Beginners)

### Why Gmail?
- Free
- Easy to set up
- Works reliably
- Perfect for testing

### Step 2.1: Enable 2-Factor Authentication

1. **Go to Gmail Account Settings:**
   - Open [myaccount.google.com](https://myaccount.google.com)
   - Click "Security" in the left menu

2. **Find "2-Step Verification":**
   - Scroll down to find "2-Step Verification"
   - Click on it
   - Follow the prompts to enable it
   - You'll need to verify with your phone

3. **Confirm it's enabled:**
   - You should see "2-Step Verification is on"

### Step 2.2: Generate App Password

1. **Go to App Passwords:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - You might need to log in again

2. **Select App and Device:**
   - Select "Mail" from the dropdown
   - Select "Windows Computer" (or your device type)
   - Click "Generate"

3. **Copy the Password:**
   - Google will show a 16-character password
   - **Copy this password** (you'll need it in the next step)
   - Example: `abcd efgh ijkl mnop`

4. **Save It Somewhere Safe:**
   - Write it down or save it in a text file
   - You'll use this in the next step

---

## Step 3: Configure Environment Variables

### Step 3.1: Open .env.local File

1. **Navigate to your project folder:**
   - Open File Explorer
   - Go to your project directory (e.g., `C:\Users\YourName\Desktop\ProjectSafetyHub`)

2. **Find or Create .env.local:**
   - Look for a file named `.env.local`
   - If it doesn't exist, create it:
     - Right-click in the folder
     - Select "New" → "Text Document"
     - Name it `.env.local`
     - Make sure it has NO `.txt` extension

3. **Open .env.local in a Text Editor:**
   - Right-click on `.env.local`
   - Select "Open with" → "Notepad" (or your preferred editor)

### Step 3.2: Add Email Configuration

**Copy and paste this into .env.local:**

```
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Replace these values:**
- `your-email@gmail.com` → Your actual Gmail address
- `abcd efgh ijkl mnop` → The 16-character password you copied from Google

**Example:**
```
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=qwer tyui asdf ghjk
```

### Step 3.3: Save the File

- Press `Ctrl + S` to save
- Close the text editor

---

## Step 4: Test Email Sending

### Step 4.1: Restart Development Server

1. **Stop the current server:**
   - Go to your terminal/command prompt
   - Press `Ctrl + C` to stop the server

2. **Start the server again:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js 16.1.6
   - Local:        http://localhost:3000
   ```

### Step 4.2: Test by Submitting a Complaint

1. **Open the application:**
   - Go to `http://localhost:3000` in your browser

2. **Login as Student:**
   - Click "Student Login"
   - Enter your credentials
   - Click "Login"

3. **Submit a Test Complaint:**
   - Click "Submit Complaint"
   - Fill in the form:
     - **Title:** "Test Complaint"
     - **Description:** "This is a test complaint"
     - **Category:** "Harassment"
     - **Branch:** "AIML"
     - Click "Submit Complaint"

4. **Check Admin Email:**
   - Open your Gmail inbox (the email you configured)
   - Look for an email with subject: "New Complaint: Test Complaint"
   - If you see it, **email is working!** ✅

### Step 4.3: Test Status Update Email

1. **Login as Admin:**
   - Logout from student account
   - Click "Admin Login"
   - Enter admin credentials
   - Click "Login"

2. **Find the Test Complaint:**
   - Go to "Branch Complaints"
   - Find the "Test Complaint" you just submitted

3. **Update the Status:**
   - Click "Respond" button
   - Change status to "In Progress"
   - Add a response: "We are investigating this"
   - Click "Update Complaint"

4. **Check Student Email:**
   - Open the student's email inbox
   - Look for email with subject: "Complaint Status Update: Test Complaint"
   - If you see it, **status updates are working!** ✅

---

## Troubleshooting

### Issue 1: "Email not configured"

**Problem:** You see this message in the server logs

**Solution:**
1. Check if `.env.local` file exists in your project root
2. Verify the file contains:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-password
   ```
3. Make sure there are NO spaces before `EMAIL_SERVICE`
4. Restart the development server (`Ctrl + C`, then `npm run dev`)

### Issue 2: "Authentication failed"

**Problem:** Email not sending, authentication error in logs

**Solution:**
1. **For Gmail:**
   - Make sure you're using the **16-character app password**, NOT your regular Gmail password
   - The app password should have spaces: `abcd efgh ijkl mnop`
   - Verify 2-Factor Authentication is enabled on your Gmail account
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and generate a new password

2. **Check your email address:**
   - Make sure `EMAIL_USER` is your complete Gmail address
   - Example: `john.doe@gmail.com` (not just `john.doe`)

### Issue 3: "Email not sending but no error"

**Problem:** No error message, but email not received

**Solution:**
1. Check your **spam/junk folder** in Gmail
2. Wait a few seconds (emails take time to send)
3. Check the **server logs** for any error messages
4. Verify the recipient email address is correct
5. Try sending a test email again

### Issue 4: "Module not found: nodemailer"

**Problem:** Error says nodemailer is not installed

**Solution:**
1. Install nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Wait for installation to complete
3. Restart the development server

### Issue 5: ".env.local file not being read"

**Problem:** Changes to .env.local don't take effect

**Solution:**
1. Stop the development server (`Ctrl + C`)
2. Delete the `.next` folder (build cache)
3. Restart the server (`npm run dev`)
4. The new environment variables should now be loaded

---

## Verification Checklist

- [ ] Installed nodemailer: `npm install nodemailer`
- [ ] Enabled 2-Factor Authentication on Gmail
- [ ] Generated app password from Google
- [ ] Created `.env.local` file in project root
- [ ] Added EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD to `.env.local`
- [ ] Saved `.env.local` file
- [ ] Restarted development server
- [ ] Submitted a test complaint as student
- [ ] Received email notification as admin
- [ ] Updated complaint status as admin
- [ ] Received status update email as student

---

## What Happens Now

### When Student Submits Complaint:
1. Complaint is saved to database
2. Email is sent to all admins/principals in that branch
3. Email contains complaint details and link to review

### When Admin Updates Status:
1. Complaint status is updated in database
2. Email is sent to the student/teacher who submitted it
3. Email contains new status and admin's response

### Email Content Examples

**Admin Notification Email:**
```
Subject: New Complaint: Test Complaint

New Complaint Submitted
- ID: abc123def456
- Title: Test Complaint
- Category: Harassment
- Branch: AIML
- Submitted by: John Student
- Email: john@college.edu
- Status: Pending

Description:
This is a test complaint

Please log in to SafetyHub to review and respond to this complaint.
```

**Student Status Update Email:**
```
Subject: Complaint Status Update: Test Complaint

Complaint Status Update
- ID: abc123def456
- Title: Test Complaint
- Category: Harassment
- Current Status: IN-PROGRESS

Your complaint is being investigated

Latest Response:
We are investigating this
By: Admin Name

Log in to SafetyHub to view more details about your complaint.
```

---

## Next Steps

1. **Test with real emails:**
   - Submit complaints from different student accounts
   - Update statuses and verify emails are sent

2. **Customize email templates (Optional):**
   - Edit email content in `app/api/[[...path]]/route.js`
   - Look for `getComplaintSubmissionEmailForAdmin()` and `getComplaintStatusEmailForStudent()`

3. **For Production:**
   - Use SendGrid or similar service instead of Gmail
   - Add company branding to emails
   - Set up email templates with HTML

---

## Common Questions

**Q: Can I use my regular Gmail password?**
A: No, you must use the 16-character app password generated from Google Account settings.

**Q: Will emails go to spam?**
A: Gmail emails usually go to inbox. If they go to spam, add the sender to your contacts.

**Q: Can I use a different email service?**
A: Yes! See `EMAIL_NOTIFICATIONS_SETUP.md` for Outlook, SendGrid, and other services.

**Q: What if I don't want to set up email?**
A: Leave EMAIL_USER and EMAIL_PASSWORD empty. The system will work normally, just without email notifications.

**Q: How many emails can I send?**
A: Gmail allows ~500 emails per day. For production, use SendGrid (100 free/day, then $0.10 per email).

---

## Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Check server logs for error messages
3. Verify all steps in the **Verification Checklist**
4. Make sure `.env.local` is in the project root directory
5. Restart the development server after any changes

---

## Summary

You now have email notifications set up! 🎉

- ✅ Admins receive emails when complaints are submitted
- ✅ Students receive emails when complaint status changes
- ✅ All emails are professional and informative
- ✅ System works even if email is not configured

Enjoy your email notification system!
