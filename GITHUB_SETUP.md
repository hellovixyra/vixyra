# GitHub Setup Guide

Follow these steps to push your code to GitHub and enable GitHub Pages for live hosting.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `vixyra` (or any name you prefer)
   - **Description**: "Vixyra - Create. Click. Wow. Advanced Canvas Editor"
   - **Visibility**: Choose Public (for free GitHub Pages) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Navigate to your project directory
cd vixyra

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vixyra.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **"Save"**
6. Wait 1-2 minutes for GitHub to build your site
7. Your site will be live at: `https://YOUR_USERNAME.github.io/vixyra/`

## Step 4: Update README with Live URL

After your site is live, update the README.md file:

1. Edit `README.md`
2. Replace `https://yourusername.github.io/vixyra/` with your actual GitHub Pages URL
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Update README with live URL"
   git push
   ```

## Step 5: Edit and Commit Directly on GitHub

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click on any file you want to edit
3. Click the **pencil icon** (✏️) to edit
4. Make your changes
5. Scroll down and click **"Commit changes"**
6. Add a commit message
7. Click **"Commit changes"**

### Method 2: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Clone your repository
4. Make changes locally
5. Commit and push using the GUI

### Method 3: Command Line (Recommended for Power Users)

```bash
# Make your changes to files

# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to GitHub
git push
```

## Quick Commands Reference

```bash
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes (if editing on GitHub)
git pull
```

## Troubleshooting

### If you get "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/vixyra.git
```

### If you get authentication errors
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop for easier authentication

### If GitHub Pages shows 404
- Make sure `index.html` is in the root directory
- Check that the branch is set to `main` in Pages settings
- Wait a few minutes for GitHub to build the site

## Your Live URLs

- **Main App**: `https://YOUR_USERNAME.github.io/vixyra/`
- **Admin Panel**: `https://YOUR_USERNAME.github.io/vixyra/admin.html`

## Next Steps

1. ✅ Repository created
2. ✅ Code pushed to GitHub
3. ✅ GitHub Pages enabled
4. ✅ Site is live!

Now you can:
- Edit files directly on GitHub
- Commit changes with one click
- Your site updates automatically (may take 1-2 minutes)

