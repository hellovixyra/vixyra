# PowerShell script to push to GitHub
# Replace YOUR_USERNAME and REPO_NAME with your actual values

Write-Host "=== GitHub Push Script ===" -ForegroundColor Green
Write-Host ""
Write-Host "Before running this script:" -ForegroundColor Yellow
Write-Host "1. Create a repository on GitHub.com" -ForegroundColor Yellow
Write-Host "2. Replace YOUR_USERNAME and REPO_NAME below" -ForegroundColor Yellow
Write-Host ""

# ============================================
# EDIT THESE VALUES:
$GITHUB_USERNAME = "YOUR_USERNAME"  # Replace with your GitHub username
$REPO_NAME = "vixyra"                # Replace with your repository name
# ============================================

if ($GITHUB_USERNAME -eq "YOUR_USERNAME") {
    Write-Host "ERROR: Please edit this script and set YOUR_USERNAME and REPO_NAME!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Edit the file: PUSH_TO_GITHUB.ps1" -ForegroundColor Yellow
    Write-Host "Change: `$GITHUB_USERNAME = `"YOUR_USERNAME`"" -ForegroundColor Yellow
    Write-Host "To: `$GITHUB_USERNAME = `"your-actual-username`"" -ForegroundColor Yellow
    exit
}

$REMOTE_URL = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

Write-Host "Repository URL: $REMOTE_URL" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists. Removing it..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
Write-Host "Adding remote repository..." -ForegroundColor Green
git remote add origin $REMOTE_URL

# Rename branch to main (if on master)
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    Write-Host "Renaming branch from 'master' to 'main'..." -ForegroundColor Green
    git branch -M main
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Green
Write-Host "You may be prompted for your GitHub credentials." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor White
    Write-Host "2. Go to Settings > Pages" -ForegroundColor White
    Write-Host "3. Select 'main' branch and '/ (root)' folder" -ForegroundColor White
    Write-Host "4. Click Save" -ForegroundColor White
    Write-Host "5. Your site will be live at: https://$GITHUB_USERNAME.github.io/$REPO_NAME/" -ForegroundColor White
    Write-Host "   Vixyra - Create. Click. Wow." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error pushing to GitHub" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "- You have created the repository on GitHub" -ForegroundColor Yellow
    Write-Host "- The repository name is correct" -ForegroundColor Yellow
    Write-Host "- You have the correct permissions" -ForegroundColor Yellow
}

