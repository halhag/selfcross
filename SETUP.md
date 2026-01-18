# GitHub Pages Setup Guide

Follow these steps to deploy SelfCross to GitHub Pages:

## 1. Create a GitHub Repository

1. Go to GitHub and create a new repository named `SelfCross`
2. **Do NOT** initialize with README, .gitignore, or license (we already have these)

## 2. Initialize Git and Push

```bash
cd c:\Source\SelfCross
git init
git add .
git commit -m "Initial commit: SelfCross word game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SelfCross.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. The workflow will automatically run on push to main

## 4. Access Your Game

After the GitHub Actions workflow completes (check the **Actions** tab), your game will be available at:

```
https://YOUR_USERNAME.github.io/SelfCross/
```

## 5. Future Updates

Any time you push to the `main` branch, the site will automatically rebuild and redeploy.

```bash
git add .
git commit -m "Your commit message"
git push
```

## Local Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

**If the page shows a blank screen:**
- Check that the `base` path in `vite.config.ts` matches your repository name
- Currently set to: `base: '/SelfCross/'`
- If your repo has a different name, update this line

**If GitHub Actions fails:**
- Check the Actions tab for error details
- Ensure GitHub Pages is enabled in repository settings
- Verify that Actions have permission to deploy (Settings → Actions → General → Workflow permissions)
