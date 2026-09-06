# Quick Email Setup - 5 Minute Guide

## TL;DR (Too Long; Didn't Read)

### 1. Install Package
```bash
npm install nodemailer
```

### 2. Enable Gmail 2FA
- Go to [myaccount.google.com/security](https://myaccount.google.com/security)
- Enable "2-Step Verification"

### 3. Get App Password
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Select "Mail" and "Windows Computer"
- Click "Generate"
- Copy the 16-character password

### 4. Create .env.local
In your project root, create a file named `.env.local` with:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `abcd efgh ijkl mnop` with the password you copied

### 5. Restart Server
```bash
npm run dev
```

### 6. Test It
1. Submit a complaint as student
2. Check your Gmail inbox for notification
3. Done! ✅

---

## Detailed Steps

### Step 1: Install Nodemailer

**Windows Command Prompt:**
```bash
npm install nodemailer
```

Wait for it to finish. You should see:
```
added 6 packages
```

---

### Step 2: Enable 2-Factor Authentication on Gmail

1. Open [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" on the left
3. Scroll down to "2-Step Verification"
4. Click it
5. Follow the steps (you'll need your phone)
6. Confirm it says "2-Step Verification is on"

---

### Step 3: Generate App Password

1. Open [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. You might need to log in again
3. Select "Mail" from first dropdown
4. Select "Windows Computer" from second dropdown
5. Click "Generate"
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

---

### Step 4: Create .env.local File

**Option A: Using Notepad**
1. Open Notepad
2. Paste this:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```
3. Replace the values with yours
4. Save as `.env.local` in your project root
5. Make sure it says "All Files" when saving (not .txt)

**Option B: Using Command Line**
```bash
echo EMAIL_SERVICE=gmail > .env.local
echo EMAIL_USER=your-email@gmail.com >> .env.local
echo EMAIL_PASSWORD=abcd efgh ijkl mnop >> .env.local
```

---

### Step 5: Restart Development Server

1. Stop current server: Press `Ctrl + C`
2. Start again:
```bash
npm run dev
```

You should see:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

---

### Step 6: Test Email

1. Go to http://localhost:3000
2. Login as student
3. Submit a complaint
4. Check your Gmail inbox
5. Look for email with subject "New Complaint: [title]"
6. If you see it, **you're done!** ✅

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Email not configured" | Check .env.local exists and has EMAIL_USER and EMAIL_PASSWORD |
| "Authentication failed" | Use 16-char app password, not regular Gmail password |
| Email not received | Check spam folder, wait a few seconds, restart server |
| "Module not found" | Run `npm install nodemailer` |
| .env.local not working | Restart server with `Ctrl + C` then `npm run dev` |

---

## What You Get

✅ Admins get email when complaint is submitted
✅ Students get email when status changes
✅ Professional formatted emails
✅ Works automatically

---

## Done! 🎉

Your email notification system is now active!

For more details, see `EMAIL_SETUP_COMPLETE_GUIDE.md`
