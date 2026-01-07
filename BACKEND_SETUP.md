# Backend API Setup for Vixyra Email Service

This guide will help you set up a backend API to send verification emails from hello.vixyra@gmail.com.

## Quick Setup Options

### Option A: Node.js/Express Server

1. **Install Dependencies**:
```bash
npm init -y
npm install express nodemailer cors dotenv
```

2. **Create `.env` file**:
```
GMAIL_APP_PASSWORD=your_gmail_app_password_here
PORT=3000
```

3. **Use the example code**: Copy `backend-api-example.js` to your server

4. **Get Gmail App Password**:
   - Go to Google Account > Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate password for "Mail"
   - Use this password in `.env`

5. **Run server**:
```bash
node backend-api-example.js
```

6. **Update `email-config.js`**:
```javascript
window.API_ENDPOINT = 'http://localhost:3000/api'; // For local
// Or 'https://your-domain.com/api' for production
```

### Option B: Serverless Function (Vercel/Netlify)

#### Vercel Setup

1. **Create `api/send-verification.js`**:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hello.vixyra@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, code, type } = req.body;

  try {
    await transporter.sendMail({
      from: '"Vixyra" <hello.vixyra@gmail.com>',
      to: to,
      subject: 'Vixyra Email Verification Code',
      html: `
        <h1>Vixyra Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

2. **Set Environment Variable in Vercel**:
   - Go to Project Settings > Environment Variables
   - Add `GMAIL_APP_PASSWORD` with your app password

3. **Update `email-config.js`**:
```javascript
window.API_ENDPOINT = 'https://your-project.vercel.app/api';
```

#### Netlify Setup

1. **Create `netlify/functions/send-verification.js`**:
```javascript
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  const { to, code } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hello.vixyra@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: '"Vixyra" <hello.vixyra@gmail.com>',
      to: to,
      subject: 'Vixyra Email Verification Code',
      html: `<h1>Your code: ${code}</h1>`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
```

2. **Set Environment Variable in Netlify**:
   - Site Settings > Build & Deploy > Environment
   - Add `GMAIL_APP_PASSWORD`

3. **Update `email-config.js`**:
```javascript
window.API_ENDPOINT = 'https://your-site.netlify.app/.netlify/functions';
```

### Option C: Python/Flask Backend

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/send-verification', methods=['POST'])
def send_verification():
    data = request.json
    to_email = data.get('to')
    code = data.get('code')
    
    if not to_email or not code:
        return jsonify({'success': False, 'message': 'Missing fields'}), 400
    
    # Send email
    msg = MIMEMultipart()
    msg['From'] = 'hello.vixyra@gmail.com'
    msg['To'] = to_email
    msg['Subject'] = 'Vixyra Email Verification Code'
    
    body = f'Your Vixyra verification code is: {code}. This code expires in 10 minutes.'
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('hello.vixyra@gmail.com', os.environ.get('GMAIL_APP_PASSWORD'))
        server.send_message(msg)
        server.quit()
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)
```

## API Endpoint Requirements

Your backend must implement:

**POST `/api/send-verification`**

Request Body:
```json
{
  "to": "user@example.com",
  "from": "hello.vixyra@gmail.com",
  "code": "123456",
  "type": "verification",
  "subject": "Vixyra Email Verification Code",
  "message": "Your code is: 123456"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

Response (Error):
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Enter "Vixyra" as the name
6. Copy the 16-character password
7. Use this password in your backend (not your regular Gmail password)

## Security Notes

- **Never commit** `.env` files or app passwords to git
- Use environment variables for sensitive data
- Consider rate limiting to prevent abuse
- Add CORS restrictions to your API
- Consider adding API key authentication

## Testing

1. Update `email-config.js` with your API endpoint
2. Test signup flow
3. Check email inbox for verification code
4. Verify the code works

## Production Deployment

- Use HTTPS for your API endpoint
- Set up proper error logging
- Monitor email sending rates
- Consider using a dedicated email service (SendGrid, AWS SES) for better deliverability

