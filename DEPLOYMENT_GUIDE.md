# Team Task Manager - Deployment Guide

## 🚀 Production Deployment

After thoroughly testing your application, follow this guide to deploy to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors
- [ ] Backend running smoothly
- [ ] Database connection stable
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] Frontend loads without errors
- [ ] Responsive design verified

---

## 🔧 Backend Deployment

### Option 1: Deploy to Render (Recommended)

**Step 1: Prepare Backend**
```bash
cd backend

# Make sure all dependencies are in package.json
npm list

# Test build locally
npm run dev  # Should work without errors
```

**Step 2: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Team Task Manager backend"
git branch -M main
git remote add origin https://github.com/yourusername/team-task-manager-backend.git
git push -u origin main
```

**Step 3: Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub

**Step 4: Create Web Service**
1. Dashboard → New + → Web Service
2. Connect GitHub repo (team-task-manager-backend)
3. Configure:
   - Name: `team-task-manager-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or paid if needed)

**Step 5: Add Environment Variables**
1. Go to Environment tab
2. Add:
   ```
   PORT=10000
   MONGODB_URI=your_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   ```

**Step 6: Deploy**
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy the generated URL: `https://team-task-manager-api.onrender.com`

### Option 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Select backend repository
4. Add environment variables
5. Deploy

### Option 3: Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create team-task-manager-api

# Add MongoDB URI
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

**Step 1: Prepare Frontend**
```bash
cd frontend

# Build for production
npm run build

# Test locally
npm run preview
```

**Step 2: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Team Task Manager frontend"
git branch -M main
git remote add origin https://github.com/yourusername/team-task-manager-frontend.git
git push -u origin main
```

**Step 3: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import Project
4. Select frontend repository

**Step 4: Configure Environment**
1. Environment Variables section:
   ```
   VITE_API_URL=https://team-task-manager-api.onrender.com/api
   ```

**Step 5: Deploy**
1. Click "Deploy"
2. Wait for build completion
3. Get your URL: `https://team-task-manager.vercel.app`

### Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop `frontend/dist` folder
3. Set environment variables
4. Deploy

### Option 3: Deploy to GitHub Pages

```bash
cd frontend

# Build
npm run build

# The dist/ folder can be deployed to GitHub Pages
```

---

## 🔗 Connect Frontend to Backend

After deploying both, update frontend `.env`:

```env
VITE_API_URL=https://your-backend-url.com/api
```

For example:
```env
VITE_API_URL=https://team-task-manager-api.onrender.com/api
```

Then redeploy frontend on Vercel.

---

## 🌍 Custom Domain Setup

### Connect Custom Domain to Vercel

1. In Vercel dashboard → Settings → Domains
2. Add custom domain: `yourdomain.com`
3. Update DNS with Vercel's nameservers
4. Wait 24-48 hours for DNS propagation

### Connect Custom Domain to Render

1. In Render dashboard → Environment → Custom Domain
2. Add domain
3. Update DNS records

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong value
- [ ] Use HTTPS for all URLs
- [ ] Enable HTTPS redirection
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB IP whitelist (all)
- [ ] Set up error logging
- [ ] Enable request logging

### Update Backend CORS for Production

In `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.com',
  credentials: true
}));
```

---

## 📊 Monitor Application

### Render Console
- View logs: Dashboard → Environment → Logs
- Monitor health: Dashboard → Status

### Vercel Analytics
- Performance metrics
- Error tracking
- Usage statistics

### MongoDB Atlas
- Connection monitoring
- Query profiler
- Alerts

---

## 🐛 Production Troubleshooting

### Backend not connecting to MongoDB
```
1. Check MongoDB IP whitelist (should be 0.0.0.0/0 or specific IPs)
2. Verify MONGODB_URI is correct
3. Check database name matches
4. Test connection locally first
```

### Frontend showing 404 errors
```
1. Verify VITE_API_URL in .env
2. Check backend is running
3. Test API endpoints manually
4. Check CORS settings
```

### CSS/Images not loading
```
1. Rebuild frontend: npm run build
2. Clear browser cache
3. Verify Vite config
4. Check public folder setup
```

### Slow performance
```
1. Check database indexes
2. Optimize queries
3. Enable caching
4. Use CDN for static files
```

---

## 📈 Scaling Considerations

### If Application Grows:

1. **Database**
   - Upgrade MongoDB tier
   - Enable sharding
   - Add read replicas

2. **Backend**
   - Use load balancer
   - Scale horizontally
   - Implement caching (Redis)

3. **Frontend**
   - Use CDN for assets
   - Implement lazy loading
   - Optimize bundle size

4. **DevOps**
   - Set up CI/CD pipeline
   - Add automated testing
   - Implement error tracking

---

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: npm run deploy
```

---

## 📱 Update Deployment

### When You Make Changes

**For Backend:**
1. Commit to GitHub
2. Render automatically redeploys
3. Or manually trigger deployment

**For Frontend:**
1. Commit to GitHub
2. Vercel automatically builds and deploys
3. Takes 2-5 minutes

---

## 💰 Cost Estimation

### Free/Cheap Tier
- **Vercel**: Free tier perfect for frontend
- **Render**: Free tier available (may go dormant)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0-5/month

### Recommended Setup
- **Vercel Pro**: $20/month (optional)
- **Render Standard**: $7/month
- **MongoDB M10**: $57/month
- **Total**: ~$80/month

---

## ✅ Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Database connection stable
- [ ] CORS configured
- [ ] Errors logged
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Domain configured (if custom)
- [ ] SSL/TLS enabled
- [ ] Backups configured
- [ ] Monitoring set up

---

## 🎉 You're Live!

Your application is now live in production! 🚀

- **Frontend**: https://team-task-manager.vercel.app
- **Backend**: https://team-task-manager-api.onrender.com
- **Database**: MongoDB Atlas (production)

### Post-Launch

1. Monitor error logs
2. Track performance metrics
3. Gather user feedback
4. Plan future improvements

---

## 📞 Support

**Having issues?**
1. Check provider's status page
2. Review application logs
3. Test endpoints manually
4. Check environment variables
5. Verify database connection

---

**Happy deploying! 🚀**
