# Email Setup Instructions - BACKEND API (Option 2)

To enable real email sending from hello.vixyra@gmail.com using a backend API.

## Option 1: EmailJS (Recommended for Frontend)

1. **Sign up for EmailJS**: Go to https://www.emailjs.com/ and create a free account

2. **Add Email Service**:
   - Go to Email Services in your EmailJS dashboard
   - Click "Add New Service"
   - Choose "Gmail" as your service
   - Connect your hello.vixyra@gmail.com account
   - Save your Service ID

3. **Create Email Template**:
   - Go to Email Templates
   - Create a new template
   - Use these variables:
     - `{{to_email}}` - Recipient email
     - `{{verification_code}}` - 6-digit code
     - `{{from_email}}` - hello.vixyra@gmail.com
   - Subject: "Vixyra Email Verification Code"
   - Body: "Your Vixyra verification code is: {{verification_code}}. This code expires in 10 minutes."
   - Save your Template ID

4. **Get Public Key**:
   - Go to Account > API Keys
   - Copy your Public Key

5. **Update email-config.js**:
   ```javascript
   window.EMAILJS_CONFIG = {
     serviceId: 'your_service_id_here',
     templateId: 'your_template_id_here',
     publicKey: 'your_public_key_here'
   };
   ```

## Option 2: Backend API

If you have a backend server, you can set up an API endpoint:

1. **Create API Endpoint**: `/api/send-verification`
   - Accepts POST request with: `{ to, from, code, type }`
   - Sends email using your email service (Nodemailer, SendGrid, etc.)
   - Returns success/error response

2. **Update email-config.js**:
   ```javascript
   window.API_ENDPOINT = 'https://your-api-endpoint.com/api';
   ```

## Email Service Examples

### Using Nodemailer (Node.js)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hello.vixyra@gmail.com',
    pass: 'your-app-password' // Use App Password, not regular password
  }
});

// Send verification email
await transporter.sendMail({
  from: 'hello.vixyra@gmail.com',
  to: email,
  subject: 'Vixyra Email Verification Code',
  text: `Your verification code is: ${code}. This code expires in 10 minutes.`
});
```

### Using SendGrid
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'hello.vixyra@gmail.com',
  subject: 'Vixyra Email Verification Code',
  text: `Your verification code is: ${code}. This code expires in 10 minutes.`
});
```

## Gmail App Password Setup

If using Gmail directly:
1. Enable 2-Step Verification on your Google account
2. Go to Google Account > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in your email service

## Testing

After setup, test the email verification:
1. Go to signup page
2. Enter email and click "Verify Email First"
3. Check the user's email inbox for the 6-digit code
4. Enter the code to verify

## Troubleshooting

- **Emails not sending**: Check email-config.js is properly configured
- **EmailJS errors**: Verify service ID, template ID, and public key are correct
- **Backend errors**: Check API endpoint is accessible and returns proper responses
- **Gmail issues**: Make sure you're using App Password, not regular password

