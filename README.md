# <img src="logo.svg" alt="Vixyra Logo" height="40" />

**Create. Click. Wow.**

A powerful, Canva-like canvas editor built with vanilla JavaScript and Fabric.js. Create stunning designs with text, shapes, images, templates, and more!

## 🚀 Live Demo

[View Live on GitHub Pages](https://yourusername.github.io/vixyra/)

## ✨ Features

### Core Features
- ✅ Add and edit text on canvas with rich formatting
- ✅ Text formatting (bold, italic, underline, strikethrough)
- ✅ Text color and background color controls
- ✅ **15+ Google Fonts** support
- ✅ Font size adjustment
- ✅ Add background images and colors
- ✅ Upload and add images
- ✅ **Shapes** (rectangles, circles, lines, arrows)
- ✅ **Layers panel** (show/hide, reorder objects)
- ✅ **Duplicate objects**
- ✅ Zoom controls (25% - 400%)
- ✅ **Multiple pages/slides** support
- ✅ **Template library** with categories
- ✅ **Stock images** gallery
- ✅ **Animation support** (fade, slide, bounce)

### Export & Share
- ✅ **Multiple export formats** (PNG, JPG, SVG, PDF)
- ✅ **Custom dimensions** for export
- ✅ **Quality settings** for export
- ✅ **Transparent background** option
- ✅ **Batch export** (all pages)
- ✅ **Print preview**
- ✅ **Shareable links**
- ✅ **Cloud storage** (localStorage-based)

### Advanced Features
- ✅ **Version history** with auto-save (every 30 seconds)
- ✅ **Undo/Redo** functionality
- ✅ **Save/Load projects** (JSON format)
- ✅ **Image filters** (blur, brightness, contrast, saturation)
- ✅ **Crop tool** for images
- ✅ **Flip horizontal/vertical**
- ✅ **Remove background** (basic)
- ✅ **Comprehensive error handling**
- ✅ **Admin panel** for data management

## 📁 File Structure

```
vixyra/
├── index.html          # Main application
├── styles.css          # All CSS styles
├── app.js              # All JavaScript functionality
├── admin.html          # Admin panel (hidden, accessible via direct link)
├── README.md           # This file
├── SERVER_SETUP.md     # Server setup guide
└── backup/             # Backup files
```

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork or clone this repository
2. Go to Settings > Pages
3. Select main branch
4. Your site will be live at: `https://yourusername.github.io/vixyra/`

### Option 2: Local Development
```bash
# Navigate to project directory
cd vixyra

# Start a local server (Python 3)
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

See [SERVER_SETUP.md](SERVER_SETUP.md) for more options.

## 🎨 Usage

1. **Add Text**: Click "Add Text" button, then click on canvas to edit
2. **Add Shapes**: Select "Shapes" from sidebar, choose a shape
3. **Format Text**: Select text and use formatting controls
4. **Change Colors**: Use color pickers for text, shapes, and canvas background
5. **Upload Images**: Click "Uploads" to add images
6. **Use Templates**: Browse templates and click to load
7. **Manage Layers**: Use Layers panel to show/hide and reorder objects
8. **Export**: Click "Export" to download in various formats
9. **Save Project**: Use "File" menu to save/load projects
10. **Version History**: Access via "File" > "Version History"

## 🔐 Admin Panel

Access the admin panel at: `your-site-url/admin.html`

Features:
- View statistics (projects, versions, templates, storage)
- Manage version history
- Clear data
- System information

## 🛠️ Technical Details

- **Fabric.js 4.6.0** for canvas manipulation
- **Pure vanilla JavaScript** (no frameworks)
- **Google Fonts API** integration
- **LocalStorage** for data persistence
- **Responsive design** for mobile and desktop
- **Error handling** with user-friendly notifications
- **Auto-save** every 30 seconds
- **Version history** with up to 50 versions

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ❌ Internet Explorer (Not supported)

## 📝 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading Fabric.js and Google Fonts from CDN)

## 🔧 Development

No build process required! Just edit the files:
- `index.html` - HTML structure
- `styles.css` - All styling
- `app.js` - All functionality

## 📄 License

This project is open source and available for use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For issues or questions:
- **Email**: hello.vixyra@gmail.com
- Check the browser console for error messages
