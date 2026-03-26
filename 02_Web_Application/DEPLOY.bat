@echo off
echo ========================================
echo   KPRFlow Enterprise - Web Deployment
echo ========================================
echo.

echo [1/6] Installing Vercel CLI...
npm install -g vercel

echo.
echo [2/6] Logging into Vercel...
vercel login

echo.
echo [3/6] Installing frontend dependencies...
cd "D:\Program Project APK WEB CRM\Belajar_Android\WORKFLOW PROTOCOL - DevPro-Enterprise\02_Web_Application\frontend"
npm install

echo.
echo [4/6] Deploying frontend to Vercel...
vercel --prod

echo.
echo [5/6] Deployment completed!
echo.
echo [6/6
] Next Steps:
echo 1. Configure environment variables in Vercel dashboard
echo 2. Set up backend deployment
echo 3. Test all functionality
echo.
echo ========================================
echo   DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo.
echo 1. Go to Vercel dashboard
echo 2. Add environment variables:
echo    - NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
echo    - NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-3370673271-c1d4f
echo    - NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://studio-3370673271-c1d4f-default-rtdb.firebaseio.com
echo    - NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDemoKeyForDevProEnterprise
echo    - NEXT_PUBLIC_WHATSAPP_PHONE=6287808131319
echo.
echo 3. Deploy backend separately or use existing server
echo.
echo 4. Test your deployed application!
echo.
echo ========================================
pause
