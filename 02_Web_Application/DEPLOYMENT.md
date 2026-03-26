# KPRFlow Enterprise - Production Deployment Guide

## 🚀 Web Production Deployment

### 📋 Prerequisites
- Node.js 18+ installed
- Git installed
- Hosting account (Vercel/Netlify/Custom Server)
- Domain name (optional)

### 🎯 Option 1: Vercel Deployment (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy Frontend
```bash
cd 02_Web_Application/frontend
vercel --prod
```

#### Step 4: Configure Environment Variables
In Vercel dashboard, add:
```
NEXT_PUBLIC_API_URL=your_backend_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
```

### 🎯 Option 2: Netlify Deployment

#### Step 1: Build Frontend
```bash
cd 02_Web_Application/frontend
npm run build
```

#### Step 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=out
```

### 🎯 Option 3: Custom Server Deployment

#### Step 1: Build Frontend
```bash
cd 02_Web_Application/frontend
npm run build
```

#### Step 2: Setup Backend Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd 02_Web_Application/backend
pm2 start server.js --name "kprflow-backend"
pm2 save
pm2 startup
```

#### Step 3: Setup Nginx (Linux Server)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/out;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🎯 Option 4: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=your_supabase_url
      - SUPABASE_ANON_KEY=your_supabase_key
```

#### Step 3: Deploy
```bash
docker-compose up -d
```

### 🔧 Environment Configuration

#### Frontend .env.production
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
```

#### Backend .env
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
WHATSAPP_PHONE=6287808131319
```

### 📊 Database Setup

#### Supabase Production
1. Create Supabase project
2. Run SQL migrations
3. Set up RLS policies
4. Configure auth settings

#### Firebase Production
1. Use existing Firebase project
2. Configure security rules
3. Set up hosting (optional)

### 🔄 Continuous Deployment

#### GitHub Actions (Auto Deploy)
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
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 🌐 Domain Configuration

#### Custom Domain
1. Point DNS to hosting provider
2. Configure SSL certificate
3. Update environment variables
4. Test all endpoints

### 📱 Mobile Access

#### PWA Features
```javascript
// next.config.js
module.exports = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true
  }
}
```

#### Add to Home Screen
- Install PWA on mobile
- Access from home screen
- Works offline with cache

### 🔍 Testing Production

#### Pre-launch Checklist
- [ ] All API endpoints working
- [ ] Database connections stable
- [ ] Firebase real-time updates
- [ ] WhatsApp integration functional
- [ ] Mobile responsive design
- [ ] SSL certificate valid
- [ ] Performance optimized
- [ ] Error monitoring setup

#### Load Testing
```bash
# Install artillery
npm install -g artillery

# Test configuration
artillery run load-test.yml
```

### 📊 Monitoring

#### Error Tracking
- Sentry for error monitoring
- Google Analytics for usage
- Uptime monitoring

#### Performance
- Google PageSpeed Insights
- Web Vitals monitoring
- Database performance

### 🚀 Go Live!

#### Final Steps
1. Update all environment variables
2. Test complete user flow
3. Backup database
4. Monitor for 24 hours
5. Announce to users

#### Success Metrics
- Page load time < 3 seconds
- 99.9% uptime
- All features functional
- Mobile responsive
- Real-time updates working

---

## 📞 Support

For deployment issues:
1. Check environment variables
2. Verify database connections
3. Review error logs
4. Test API endpoints
5. Monitor performance

---

**🎯 Your KPRFlow Enterprise will be 24/7 online!**
