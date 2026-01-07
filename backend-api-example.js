// Backend API Example for Vixyra Email Service
// This is a Node.js/Express example - adapt to your backend framework

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hello.vixyra@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password from Google Account
  }
});

// Email verification endpoint
app.post('/api/send-verification', async (req, res) => {
  try {
    const { to, from, code, type, subject, message } = req.body;

    // Validate required fields
    if (!to || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, code' 
      });
    }

    // Determine email content based on type
    let emailSubject = subject || 'Vixyra Email Verification Code';
    let emailText = message || `Your Vixyra verification code is: ${code}. This code expires in 10 minutes.`;
    let emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vixyra</h1>
            <p>Create. Click. Wow.</p>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© 2024 Vixyra. All rights reserved.</p>
              <p>Contact: hello.vixyra@gmail.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"Vixyra" <${from || 'hello.vixyra@gmail.com'}>`,
      to: to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Verification code sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

// Password reset endpoint (uses same email sending logic)
app.post('/api/send-password-reset', async (req, res) => {
  try {
    const { to, code } = req.body;

    if (!to || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vixyra</h1>
            <p>Password Reset</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Your password reset code is:</p>
            <div class="code">${code}</div>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <div class="footer">
              <p>© 2024 Vixyra. All rights reserved.</p>
              <p>Contact: hello.vixyra@gmail.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Vixyra" <hello.vixyra@gmail.com>',
      to: to,
      subject: 'Vixyra Password Reset Code',
      text: `Your password reset code is: ${code}. This code expires in 10 minutes.`,
      html: emailHtml
    });

    res.json({ 
      success: true, 
      message: 'Password reset code sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Vixyra Email Service' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vixyra Email API running on port ${PORT}`);
});

// Export for serverless functions (Vercel, Netlify, etc.)
module.exports = app;

