# ChainTrees - Vercel Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- ✅ Vercel account ([sign up here](https://vercel.com/signup))
- ✅ GitHub repository connected
- ✅ Environment variables ready

---

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

The CLI will guide you through:
1. Setting up the project
2. Linking to your Vercel account
3. Configuring build settings
4. Adding environment variables

---

## Method 2: Deploy via Vercel Dashboard

### Step 1: Push to GitHub
```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your ChainTrees repository
4. Click "Import"

### Step 3: Configure Project
**Framework Preset**: Vite  
**Root Directory**: `./`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_INFURA_API_KEY=your_infura_key_here
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
VITE_PINATA_API_KEY=your_pinata_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_here
```

**Important**: Make sure to add these for all environments (Production, Preview, Development)

### Step 5: Deploy
Click "Deploy" and wait for the build to complete!

---

## Method 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CasmanKaido/ChainTrees)

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `chaintrees.app`)
4. Follow DNS configuration instructions

### 2. Environment Variables
Verify all environment variables are set correctly:
- Go to Project Settings → Environment Variables
- Ensure all `VITE_*` variables are present
- Redeploy if you add/change variables

### 3. Enable Analytics (Optional)
1. Go to Project Settings → Analytics
2. Enable Vercel Analytics
3. Track page views and performance

---

## 🧪 Testing Your Deployment

### 1. Check Build Logs
- Go to Deployments tab
- Click on latest deployment
- Review build logs for errors

### 2. Test the Live Site
Visit your deployment URL and test:
- ✅ Wallet connection works
- ✅ All pages load correctly
- ✅ No console errors
- ✅ Images and assets load
- ✅ Environment variables are working

### 3. Test on Different Devices
- Desktop browsers (Chrome, Firefox, Safari)
- Mobile browsers (iOS Safari, Chrome)
- Different screen sizes

---

## 🔍 Troubleshooting

### Build Fails
**Issue**: Build command fails  
**Solution**: 
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Environment Variables Not Working
**Issue**: App can't connect to services  
**Solution**:
- Ensure all `VITE_*` variables are prefixed correctly
- Redeploy after adding variables
- Check variable values don't have extra spaces

### 404 Errors on Routes
**Issue**: Direct URLs return 404  
**Solution**: Vercel should auto-configure for SPA, but if needed, add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Slow Build Times
**Issue**: Builds take too long  
**Solution**:
- Enable build caching in Vercel settings
- Optimize dependencies
- Use `npm ci` instead of `npm install`

---

## 📊 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] `.env` file NOT committed to git
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview build succeeds (`npm run preview`)
- [ ] All tests pass (`npm run test`)
- [ ] Smart contracts deployed to desired network
- [ ] Contract addresses updated in code
- [ ] IPFS/Pinata configured
- [ ] WalletConnect Project ID valid
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled (optional)

---

## 🎯 Expected Results

After successful deployment:

✅ **Live URL**: `https://chaintrees.vercel.app` (or your custom domain)  
✅ **Build Time**: ~2-3 minutes  
✅ **Performance**: Lighthouse score 90+  
✅ **SSL**: Automatic HTTPS  
✅ **CDN**: Global edge network  
✅ **Auto-deploys**: On every git push to main  

---

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request
- **Development**: Every push to other branches

To disable auto-deploy:
1. Go to Project Settings → Git
2. Configure deployment branches

---

## 📈 Monitoring

### Vercel Analytics
- Page views
- Unique visitors
- Top pages
- Performance metrics

### Error Tracking (Optional)
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for detailed analytics

---

## 🚀 Production URL

Once deployed, your ChainTrees app will be live at:

**Preview**: `https://chaintrees-[random].vercel.app`  
**Production**: `https://chaintrees.vercel.app`  
**Custom Domain**: `https://your-domain.com` (if configured)

---

## 🎉 You're Live!

Your ChainTrees application is now deployed and accessible worldwide!

Share your deployment:
- Tweet about it 🐦
- Share on Discord 💬
- Add to your portfolio 📁
- Submit to Web3 directories 🌐

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

**Happy Deploying! 🌳🚀**
