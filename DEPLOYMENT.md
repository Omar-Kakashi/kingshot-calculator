# 🚀 Deployment Guide - GitHub Pages

Your Kings Shot Calculator is now ready to be published online for free using GitHub Pages!

## ✅ What's Been Set Up

1. ✅ All code pushed to GitHub
2. ✅ Root `index.html` redirect page created
3. ✅ GitHub Actions workflow configured
4. ✅ Automatic deployment ready

## 🌐 Publishing Steps

### Step 1: Enable GitHub Pages

1. Go to your repository: **https://github.com/Omar-Kakashi/kingshot-calculator**

2. Click on **Settings** (top menu)

3. Scroll down to **Pages** in the left sidebar

4. Under **Source**, select:
   - Source: **GitHub Actions**

5. Save (if needed)

### Step 2: Wait for Deployment

The GitHub Actions workflow will automatically:
- Build your site
- Deploy to GitHub Pages
- Usually takes 1-2 minutes

### Step 3: Access Your Live Site

Once deployed, your calculator will be available at:

**🌐 https://omar-kakashi.github.io/kingshot-calculator/**

## 📋 What Happens Automatically

Every time you push to the `main` branch:
1. GitHub Actions workflow triggers
2. Site is automatically rebuilt
3. Changes go live within 1-2 minutes
4. No manual deployment needed!

## 🔍 Check Deployment Status

1. Go to your repository
2. Click the **Actions** tab
3. See the latest "Deploy to GitHub Pages" workflow
4. Green checkmark = successfully deployed ✅
5. Red X = deployment failed ❌ (check logs)

## 🎯 How It Works

### Root Redirect (`index.html`)
- Located at the root of your repository
- Automatically redirects to `src/index.html`
- Shows a loading screen during redirect
- Ensures GitHub Pages serves the calculator correctly

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically triggers on push to `main`
- Deploys entire repository to GitHub Pages
- No build step needed (pure HTML/CSS/JS)

## 🌍 Sharing Your Calculator

Once live, share the URL:
```
https://omar-kakashi.github.io/kingshot-calculator/
```

With:
- Alliance members
- Game community
- Social media
- Game forums

## 📱 Mobile Access

The calculator is fully responsive and works perfectly on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets
- 💻 Desktops
- All modern browsers

## 🔧 Updating Your Site

To update the calculator:

1. Make changes locally
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Update calculator features"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. Wait 1-2 minutes - changes are live automatically!

## 🎨 Custom Domain (Optional)

Want a custom domain like `kingshot-calc.com`?

1. Buy a domain from any registrar
2. Go to repository Settings → Pages
3. Add your custom domain
4. Follow GitHub's DNS instructions
5. Enable HTTPS

## ⚡ Quick Commands Reference

```bash
# Check status
git status

# Stage all changes
git add -A

# Commit changes
git commit -m "Your message"

# Push to GitHub (auto-deploys)
git push origin main

# View deployment logs
# Go to: https://github.com/Omar-Kakashi/kingshot-calculator/actions
```

## 🐛 Troubleshooting

### Site Not Loading?

1. **Check Actions Tab**
   - Green checkmark? Deployment succeeded
   - Red X? Click to see error logs

2. **Wait a Few Minutes**
   - First deployment can take 2-5 minutes
   - Subsequent deployments are faster

3. **Check GitHub Pages Settings**
   - Make sure "Source" is set to "GitHub Actions"
   - URL should show: `https://omar-kakashi.github.io/kingshot-calculator/`

4. **Clear Browser Cache**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private mode

### 404 Error?

- Make sure you have `index.html` in the root
- Check that the redirect is working
- Verify the `src/index.html` file exists

### CSS/JS Not Loading?

- Check that paths in HTML are relative (not absolute)
- Verify files are in the correct folders
- Look at browser console for errors (F12)

## 📊 Analytics (Optional)

Want to track visitors? Add Google Analytics:

1. Get Google Analytics tracking code
2. Add to `src/index.html` in the `<head>` section
3. Commit and push
4. Track usage statistics

## 🔒 Privacy & Security

- All calculations happen client-side
- No data sent to servers
- No backend required
- No database
- User data stays in their browser (LocalStorage)
- HTTPS enabled by default on GitHub Pages

## 🎉 You're Live!

**Your calculator is now published and accessible worldwide!**

Share it with the Kings Shot community and help players optimize their resources!

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Actions tab](https://github.com/Omar-Kakashi/kingshot-calculator/actions) for deployment logs
2. Review this guide carefully
3. Check GitHub Pages documentation
4. Make sure all files are committed and pushed

---

**Your live calculator:** https://omar-kakashi.github.io/kingshot-calculator/

**May your kingdoms prosper! ⚔️👑**
