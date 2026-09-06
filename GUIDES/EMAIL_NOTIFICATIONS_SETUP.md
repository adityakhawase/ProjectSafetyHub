# Email Notifications Setup Guide

## Overview
The system now sends email notifications for:
1. **New Complaint Submission** - Admin/Principal receives email when student/teacher submits complaint
2. **Status Updates** - Student/Teacher receives email when complaint status changes (pending → in-progress → resolved)

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install nodemailer
# or
yarn add nodemailer
```

### Step 2: Configure Email Service

Choose one of the following options:

#### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "App passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. **Add to .env.local**:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

#### Option B: Other Email Services (Outlook, Yahoo, etc.)

```
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

Or for custom SMTP:
```
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

#### Option C: SendGrid (Production Recommended)

1. Create SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Generate API key
3. Add to .env.local:
```
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Step 3: Verify Setup

Test by submitting a complaint:
1. Login as student/teacher
2. Submit a complaint
3. Check admin/principal email for notification
4. Admin updates complaint status
5. Check student/teacher email for status update

## Email Templates

### Admin Notification Email
When a student/teacher submits a complaint, admin receives:
- Complaint ID
- Title and Category
- Branch
- Submitter name and email
- Full description
- Current status
- Link to login and review

### Student/Teacher Status Update Email
When admin updates complaint status, student/teacher receives:
- Complaint ID
- Title and Category
- New status (PENDING / IN-PROGRESS / RESOLVED)
- Latest admin response (if any)
- Link to login and view details

## Environment Variables

```bash
# Email Service Configuration
EMAIL_SERVICE=gmail              # Service provider (gmail, outlook, sendgrid, etc.)
EMAIL_USER=your-email@gmail.com  # Email address to send from
EMAIL_PASSWORD=app-password      # Password or API key
```

## Troubleshooting

### "Email not configured"
- Check if EMAIL_USER and EMAIL_PASSWORD are set in .env.local
- Restart the development server after adding env variables

### "Authentication failed"
- Verify email credentials are correct
- For Gmail: Use 16-character app password, not regular password
- For other services: Check if 2FA is enabled

### "Email not sending"
- Check server logs for error messages
- Verify email address format is correct
- Check if email service is accessible from your network

### "Emails going to spam"
- Add your email to contacts
- Check spam/junk folder
- For production: Use SendGrid or similar service for better deliverability

## Production Recommendations

1. **Use SendGrid or similar service** instead of Gmail
2. **Add email templates** with company branding
3. **Implement email queue** for reliability
4. **Add retry logic** for failed emails
5. **Monitor email delivery** rates
6. **Use environment-specific** email addresses

## Testing Without Email

If you don't want to set up email yet:
1. Leave EMAIL_USER and EMAIL_PASSWORD empty
2. System will log "Email not configured" and skip sending
3. Emails won't be sent but system will work normally

## Email Customization

To customize email templates, edit these functions in `app/api/[[...path]]/route.js`:
- `getComplaintSubmissionEmailForAdmin()` - Admin notification
- `getComplaintStatusEmailForStudent()` - Status update notification

## Monitoring

Check server logs for email sending status:
```
Email sent successfully to: admin@example.com
Email not configured. Skipping email send.
Error sending email: [error details]
```

## Cost Estimation

- **Gmail**: Free (limited to ~500 emails/day)
- **SendGrid**: Free tier (100 emails/day), then $0.10 per email
- **Outlook**: Free
- **Custom SMTP**: Depends on provider

## Next Steps

1. Install nodemailer: `npm install nodemailer`
2. Configure email in .env.local
3. Restart development server
4. Test by submitting a complaint
5. Check email inbox for notifications
