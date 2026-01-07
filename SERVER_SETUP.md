# Vixyra - Server Setup Guide

**Create. Click. Wow.**

This guide will help you set up a local development server for Vixyra.

## Quick Start

### Option 1: Python HTTP Server (Recommended for Quick Testing)

**Python 3:**
```bash
# Navigate to the project directory
cd vixyra

# Start the server
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

---

### Option 2: Node.js HTTP Server

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to the project directory
cd vixyra

# Start the server
http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

---

### Option 3: PHP Built-in Server

If you have PHP installed:

```bash
# Navigate to the project directory
cd vixyra

# Start the server
php -S localhost:8000
```

Then open your browser and go to: `http://localhost:8000`

---

### Option 4: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## Production Deployment

### Static Hosting Services

Vixyra is a static web application and can be deployed to any static hosting service:

#### Netlify
1. Create a new site
2. Drag and drop the project folder
3. Your site will be live instantly

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### GitHub Pages
1. Create a repository
2. Upload all files
3. Go to Settings > Pages
4. Select the main branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

## File Structure

```
vixyra/
├── index.html          # Main application file
├── styles.css          # All CSS styles
├── app.js              # All JavaScript functionality
├── admin.html          # Admin panel (hidden, accessible via direct link)
├── README.md           # Project documentation
├── SERVER_SETUP.md     # This file
└── backup/             # Backup files (if created)
```

---

## Important Notes

1. **CORS Issues**: Some browsers may block local file access. Always use a local server instead of opening `index.html` directly.

2. **Admin Panel Access**: 
   - The admin panel is accessible at: `http://localhost:8000/admin.html`
   - It's not linked from the main application
   - Only accessible via direct URL

3. **LocalStorage**: 
   - All data is stored in browser's localStorage
   - Data persists between sessions
   - Clearing browser data will remove saved projects

4. **Internet Connection**: 
   - Required for loading Fabric.js library from CDN
   - Required for Google Fonts
   - Required for stock images (if using external URLs)

---

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, use a different port:
- Python: `python -m http.server 8080`
- Node.js: `http-server -p 8080`
- PHP: `php -S localhost:8080`

### CORS Errors
Make sure you're accessing the files through a web server, not directly via `file://` protocol.

### Fabric.js Not Loading
- Check your internet connection
- The app will try multiple CDN sources automatically
- Check browser console for errors

### Features Not Working
- Open browser console (F12) to check for errors
- Make sure all files (index.html, styles.css, app.js) are in the same directory
- Clear browser cache and reload

---

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (Not supported)

---

## Security Notes

- The admin panel has no authentication. In production, add proper authentication.
- All data is stored locally in the browser. No server-side storage.
- For production use, consider adding:
  - User authentication
  - Server-side data storage
  - API endpoints for cloud features
  - Rate limiting
  - Input validation

---

## Support

For issues or questions:
- **Email**: hello.vixyra@gmail.com
- Check the browser console for error messages and ensure all files are properly loaded.

