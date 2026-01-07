# Quick Email Setup Guide

## The Error You're Seeing

If you see: **"Email service not configured. Please configure API_ENDPOINT in email-config.js"**

This means you need to set up a backend server to send emails.

## Fastest Setup (5 minutes)

### Step 1: Create Backend Server Folder

Create a new folder (e.g., `vixyra-backend`) outside your frontend project:

```bash
mkdir vixyra-backend
cd vixyra-backend
```

### Step 2: Install Dependencies

```bash
npm init -y
npm install express nodemailer cors dotenv
```

### Step 3: Create Server File

Create `server.js` and copy the content from `backend-api-example.js`:

```bash
# Copy the example file content
```

Or create `server.js` with this minimal code:

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hello.vixyra@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.post('/api/send-verification', async (req, res) => {
  try {
    const { to, code, subject, message } = req.body;
    
    if (!to || !code) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    await transporter.sendMail({
      from: '"Vixyra" <hello.vixyra@gmail.com>',
      to: to,
      subject: subject || 'Vixyra Email Verification Code',
      html: `
        <h1>Vixyra Verification Code</h1>
        <p>Your verification code is: <strong style="font-size: 24px; letter-spacing: 4px;">${code}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Email server running on http://localhost:${PORT}`);
});
```

### Step 4: Get Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and device "Other"
5. Name it "Vixyra Server"
6. Click "Generate"
7. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 5: Create .env File

In your `vixyra-backend` folder, create `.env`:

```
GMAIL_APP_PASSWORD=your_16_character_app_password_here
PORT=3000
```

**Important:** Remove spaces from the app password if it has any.

### Step 6: Start Server

```bash
node server.js
```

You should see: `✅ Email server running on http://localhost:3000`

### Step 7: Update Frontend Config

In your frontend project, edit `email-config.js`:

```javascript
window.API_ENDPOINT = 'http://localhost:3000/api';
```

### Step 8: Test

1. Keep the backend server running
2. Open your frontend app
3. Try to sign up - it should send a real email!

## Production Deployment

### Option A: Deploy to Vercel

1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

2. Set environment variable in Vercel dashboard:
   - `GMAIL_APP_PASSWORD` = your app password

3. Deploy and update `email-config.js`:
```javascript
window.API_ENDPOINT = 'https://your-project.vercel.app/api';
```

### Option B: Deploy to Heroku

1. Create `Procfile`:
```
web: node server.js
```

2. Deploy:
```bash
heroku create vixyra-email-api
heroku config:set GMAIL_APP_PASSWORD=your_app_password
git push heroku main
```

3. Update `email-config.js`:
```javascript
window.API_ENDPOINT = 'https://vixyra-email-api.herokuapp.com/api';
```

## Troubleshooting

**"Cannot connect to server"**
- Make sure backend server is running
- Check the URL in `email-config.js` matches your server
- For local: use `http://localhost:3000/api`

**"Authentication failed"**
- Make sure you're using App Password, not regular password
- Check `.env` file has correct password
- Restart server after changing `.env`

**"Email not sending"**
- Check server console for errors
- Verify Gmail App Password is correct
- Make sure 2-Step Verification is enabled

## Need Help?

If you're stuck, check:
- `BACKEND_SETUP.md` for detailed instructions
- `backend-api-example.js` for full example code
- Server console logs for error messages

