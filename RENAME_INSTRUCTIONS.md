# Rename Directory Instructions

To rename the directory from `react-canvas-editor-master` to `vixyra`:

## Option 1: Using File Explorer (Recommended)

1. **Close all files** - Make sure all files in the directory are closed (close VS Code, Cursor, or any other editors)
2. **Close any terminals** - Close PowerShell/Command Prompt windows that are in this directory
3. Navigate to: `C:\Users\pandy\OneDrive\Desktop\GG\`
4. Right-click on `react-canvas-editor-master` folder
5. Select "Rename"
6. Type: `vixyra`
7. Press Enter

## Option 2: Using PowerShell

1. **Close all files and terminals first**
2. Open a NEW PowerShell window
3. Run these commands:

```powershell
cd C:\Users\pandy\OneDrive\Desktop\GG
Rename-Item -Path "react-canvas-editor-master" -NewName "vixyra"
cd vixyra
git status
```

## After Renaming

1. Open the project from the new `vixyra` directory
2. Verify git still works: `git status`
3. All your code and git history will be preserved

## Note

The directory rename doesn't affect your code - it's just the folder name. All files inside remain the same.

