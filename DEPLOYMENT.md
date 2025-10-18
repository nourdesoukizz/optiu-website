# OptiU Website Deployment Guide

## Railway Deployment Instructions

### Prerequisites
1. Railway account: [railway.app](https://railway.app)
2. GitHub repository with this code (already done)

### Deployment Steps

#### Option 1: Deploy via Railway Dashboard (Recommended)
1. Go to [railway.app](https://railway.app) and login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose the repository: `nourdesoukizz/optiu-website`
5. Railway will automatically detect the Dockerfile and deploy

#### Option 2: Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Configuration Files Created

1. **Dockerfile** - Builds the website using nginx:alpine
2. **nginx.conf** - Custom nginx configuration for serving static files
3. **railway.json** - Railway-specific deployment configuration
4. **.dockerignore** - Excludes unnecessary files from Docker build
5. **.gitignore** - Standard git ignore patterns

### Features Included in Deployment

✅ **Static Website Serving**
- All HTML pages (landing-page.html, marketplace.html, chat.html, opti.html, overview.html)
- Static assets (images, videos, JS files)
- Proper MIME type handling

✅ **Performance Optimizations**
- Gzip compression enabled
- Static asset caching (1 year for images/videos)
- Optimized nginx configuration

✅ **Security Headers**
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Content Security Policy
- Referrer Policy

✅ **SEO & Routing**
- Default route redirects to landing page
- Clean URL handling
- Proper 404 handling

### Website Structure After Deployment

```
/                           → redirects to /landing-page.html
/landing-page.html         → Home page
/marketplace.html          → AOM Marketplace with POC form
/chat.html                 → Chat interface
/opti.html                 → Opti information page
/overview.html             → Overview page
/js/                       → JavaScript files
/videos/                   → Video assets
/docs/                     → Documentation
/optiu2.png               → Logo
```

### Environment Variables (if needed)
Railway will automatically handle environment variables. The current setup doesn't require any.

### Custom Domain (Optional)
After deployment:
1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Monitoring & Logs
- View deployment logs in Railway dashboard
- Monitor performance and uptime
- Access nginx logs for debugging

### Troubleshooting

**Build Issues:**
- Check Dockerfile syntax
- Verify all files are committed to git
- Review Railway build logs

**Nginx Issues:**
- Check nginx.conf syntax
- Verify file paths in COPY commands
- Test locally with Docker if possible

**Performance Issues:**
- Enable gzip compression (already configured)
- Optimize image sizes
- Use CDN for large assets

### Future Enhancements

**API Integration:**
The `api/` directory contains Flask chat API that can be deployed separately:
1. Create new Railway service for API
2. Update nginx.conf to proxy API requests
3. Set up environment variables for OpenAI API

**Database:**
If database is needed:
1. Add PostgreSQL plugin in Railway
2. Update application to use database
3. Configure connection strings

### Cost Estimation
- Railway Hobby Plan: $5/month
- Includes 500 hours of runtime
- Perfect for small to medium websites

### Support
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- OptiU Website Repository: [github.com/nourdesoukizz/optiu-website](https://github.com/nourdesoukizz/optiu-website)