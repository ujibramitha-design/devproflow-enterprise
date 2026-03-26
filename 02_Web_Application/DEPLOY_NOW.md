# 🚀 KPRFlow Enterprise - Web Deployment Guide

## 📋 DEPLOYMENT INSTRUCTIONS

### 🎯 OPTION 1: VERCEL DEPLOYMENT (RECOMMENDED)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
# Follow browser authentication
```

#### Step 3: Navigate to Frontend Directory
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\frontend"
```

#### Step 4: Install Dependencies
```bash
npm install
```

#### Step 5: Deploy Frontend
```bash
vercel --prod
```

#### Step 6: Configure Environment Variables in Vercel Dashboard
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDemoKeyForDevProEnterprise
NEXT_PUBLIC_WHATSAPP_PHONE=6287808131319
```

### 🎯 OPTION 2: NETLIFY DEPLOYMENT

#### Step 1: Build Frontend
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\frontend"
npm install
npm run build
```

#### Step 2: Install Netlify CLI
```bash
npm install -g netlify-cli
netlify login
```

#### Step 3: Deploy
```bash
npm run deploy:netlify
```

### 🎯 OPTION 3: CUSTOM SERVER DEPLOYMENT

#### Step 1: Build Frontend
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\frontend"
npm run build
```

#### Step 2: Setup Backend
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\backend"
npm install

# Install PM2 for process management
npm install -g pm2

# Start backend
pm2 start server.js --name "kprflow-backend"
pm2 save
pm2 startup
```

#### Step 3: Configure Web Server (Nginx/Apache)
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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 🔧 ENVIRONMENT SETUP

#### Frontend .env.production
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\frontend"
cp .env.production.example .env.production
```

Edit `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDemoKeyForDevProEnterprise
NEXT_PUBLIC_WHATSAPP_PHONE=6287808131319
```

#### Backend .env
```bash
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\backend"
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
WHATSAPP_PHONE=6287808131319
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=https://your-domain.com
```

### 🌐 DEPLOYMENT URLS

#### After Deployment:
- **Frontend**: Your Vercel/Netlify/Custom domain URL
- **Backend API**: https://your-domain.com/api
- **API Health Check**: https://your-domain.com/api/health
- **Application**: https://your-domain.com

### ✅ POST-DEPLOYMENT VERIFICATION

#### Test URLs:
```bash
# Test frontend
curl https://your-domain.com

# Test backend API
curl https://your-domain.com/api/health

# Test units API
curl https://your-domain.com/api/units

# Test dashboard stats
curl https://your-domain.com/api/dashboard/stats
```

#### Manual Testing:
1. Open frontend URL in browser
2. Check all pages load correctly
3. Test real-time Firebase updates
4. Test WhatsApp integration
5. Verify dashboard functionality

### 📱 MOBILE ACCESS

#### PWA Installation:
1. Open deployed URL on mobile browser
2. Tap "Add to Home Screen"
3. Install as PWA app
4. Access from home screen

### 🔍 TROUBLESHOOTING

#### Common Issues:
1. **Environment Variables**: Ensure all are set correctly
2. **Firebase Connection**: Verify Firebase project is active
3. **Backend API**: Check if backend is running on port 3001
4. **CORS Issues**: Verify CORS_ORIGIN is set correctly
5. **Build Errors**: Check npm install completed successfully

#### Debug Commands:
```bash
# Check frontend logs
vercel logs

# Check backend status
pm2 status

# Test backend locally
cd backend && npm start
```

### 📊 SUCCESS METRICS

#### Expected Results:
- ✅ Frontend loads in <3 seconds
- ✅ All pages accessible
- ✅ Real-time data updates working
- ✅ WhatsApp integration functional
- ✅ Mobile responsive design
- ✅ PWA installable

### 🎯 NEXT STEPS

After successful deployment:
1. Share URL with team
2. Test all functionality
3. Monitor performance
4. Set up analytics (optional)
5. Plan mobile/desktop deployment

---

## 🚀 READY TO DEPLOY!

Choose your preferred deployment option and follow the steps above.
