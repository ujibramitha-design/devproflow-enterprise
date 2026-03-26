# Web Implementation Guide - Direct Component Reuse

**Platform:** 02_Web_Application (Platform B)  
**Strategy:** 100% Direct Use  
**Source:** 05_UI_Design_System/Implementation/Web/

---

## Overview

Web platform menggunakan **100% direct component reuse** dari 05_UI_Design_System.

**✅ YA:** Import komponen langsung dari 05_UI_Design_System  
**❌ TIDAK:** Duplicate atau recreate komponen

---

## Why Direct Reuse?

**Advantages:**
- ✅ Same technology stack (Next.js 15 + React 19)
- ✅ Same styling system (Tailwind CSS 4)
- ✅ Same component library (shadcn/ui)
- ✅ Zero adaptation needed
- ✅ Instant updates when 05 changes
- ✅ No code duplication
- ✅ Consistent UI across web platforms

---

## Setup

### Option 1: Symlink (Recommended for Development)

```bash
# Navigate to frontend src directory
cd 02_Web_Application/frontend/src/

# Create symlink to 05_UI_Design_System components
# Windows (PowerShell as Admin)
New-Item -ItemType SymbolicLink -Path "components" -Target "..\..\..\05_UI_Design_System\Implementation\Web\components"

# macOS/Linux
ln -s ../../../05_UI_Design_System/Implementation/Web/components components

# Create symlink for app directory
New-Item -ItemType SymbolicLink -Path "app" -Target "..\..\..\05_UI_Design_System\Implementation\Web\app"
```

**Benefits:**
- Changes in 05 immediately reflect in 02
- No manual sync needed
- Single source of truth

**Drawbacks:**
- Requires symlink support
- May complicate deployment

### Option 2: Direct Import (Recommended for Production)

```typescript
// 02_Web_Application/frontend/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["../../../05_UI_Design_System/Implementation/Web/components/*"],
      "@/app/*": ["../../../05_UI_Design_System/Implementation/Web/app/*"],
      "@/lib/*": ["../../../05_UI_Design_System/Implementation/Web/lib/*"]
    }
  }
}
```

### Option 3: Copy (For Independent Deployment)

```bash
# Copy components for independent deployment
robocopy "05_UI_Design_System\Implementation\Web\components" ^
         "02_Web_Application\frontend\src\components" ^
         /E /COPY:DAT

robocopy "05_UI_Design_System\Implementation\Web\app" ^
         "02_Web_Application\frontend\src\app" ^
         /E /COPY:DAT
```

**Note:** Requires manual sync when 05 updates

---

## Usage Examples

### Import UI Components

```typescript
// 02_Web_Application/frontend/src/app/page.tsx

// ✅ Direct import from 05_UI_Design_System
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to DevPro Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search..." className="mb-4" />
          <Button>Get Started</Button>
          <Badge variant="success">Active</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Import Dashboard Components

```typescript
// 02_Web_Application/frontend/src/app/dashboard/page.tsx

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { RecentApplications } from '@/components/dashboard/recent-applications';

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-8">
          <KpiCards />
          <RecentApplications />
        </main>
      </div>
    </div>
  );
}
```

### Use Shared Tailwind Config

```typescript
// 02_Web_Application/frontend/tailwind.config.ts

// ✅ Import from 05_UI_Design_System
export { default } from '../../05_UI_Design_System/Implementation/Web/tailwind.config.tokens';

// Or extend if needed
import baseConfig from '../../05_UI_Design_System/Implementation/Web/tailwind.config.tokens';

export default {
  ...baseConfig,
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    // Include 05_UI_Design_System components
    '../../../05_UI_Design_System/Implementation/Web/components/**/*.{ts,tsx}',
  ],
  // Add 02-specific customizations if needed
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      // 02-specific extensions
    },
  },
};
```

---

## Application-Specific Features

### API Routes (02-Specific)

```typescript
// 02_Web_Application/frontend/src/app/api/units/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch from backend
  const response = await fetch('http://localhost:3002/api/units');
  const data = await response.json();
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Create unit
  const response = await fetch('http://localhost:3002/api/units', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  return NextResponse.json(await response.json());
}
```

### Middleware (02-Specific)

```typescript
// 02_Web_Application/frontend/src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### Environment Variables (02-Specific)

```bash
# 02_Web_Application/frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## File Structure

```
02_Web_Application/frontend/
├── src/
│   ├── app/                    ← 02-specific pages
│   │   ├── api/                ← API routes (02-specific)
│   │   ├── dashboard/          ← Dashboard pages
│   │   ├── units/              ← Unit pages
│   │   └── page.tsx            ← Home page
│   ├── components/             ← Symlink or import from 05
│   │   ├── ui/                 ← From 05_UI_Design_System
│   │   └── dashboard/          ← From 05_UI_Design_System
│   ├── lib/                    ← 02-specific utilities
│   │   ├── api.ts              ← API client
│   │   └── auth.ts             ← Auth utilities
│   └── middleware.ts           ← 02-specific middleware
├── public/                     ← 02-specific assets
├── .env.local                  ← 02-specific env vars
├── next.config.js              ← 02-specific config
├── package.json                ← 02-specific dependencies
└── tailwind.config.ts          ← Import from 05
```

---

## Development Workflow

### 1. Start Development Server

```bash
cd 02_Web_Application/frontend
npm run dev
```

### 2. Create New Page

```typescript
// src/app/units/page.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnitsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Units</h1>
      <Card>
        {/* Use components from 05 */}
        <Button>Add Unit</Button>
      </Card>
    </div>
  );
}
```

### 3. Use Existing Components

```typescript
// All components from 05_UI_Design_System are available
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Dialog,
  Table,
  // ... 57 UI components
} from '@/components/ui/...';

import {
  DashboardSidebar,
  DashboardTopbar,
  KpiCards,
  // ... 9 dashboard components
} from '@/components/dashboard/...';
```

---

## Best Practices

### DO ✅

1. **Import components from 05_UI_Design_System**
   ```typescript
   import { Button } from '@/components/ui/button';
   ```

2. **Use Tailwind classes from shared config**
   ```tsx
   <div className="bg-primary text-primary-foreground">
   ```

3. **Keep 02-specific code in app/ and lib/**
   ```typescript
   // 02-specific API client
   // src/lib/api.ts
   ```

4. **Use environment variables for config**
   ```typescript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   ```

5. **Leverage Next.js features**
   - Server Components
   - API Routes
   - Middleware
   - Image Optimization

### DON'T ❌

1. **Don't duplicate components**
   ```typescript
   // ❌ WRONG - Creating duplicate Button
   // src/components/ui/button.tsx
   ```

2. **Don't hard-code design values**
   ```typescript
   // ❌ WRONG
   <div style={{ backgroundColor: '#3B82F6' }}>
   
   // ✅ CORRECT
   <div className="bg-primary">
   ```

3. **Don't modify 05 components directly**
   - If you need customization, extend or wrap
   - Don't edit files in 05_UI_Design_System

4. **Don't create separate design system**
   - Always use 05_UI_Design_System as source

---

## Deployment

### Build for Production

```bash
cd 02_Web_Application/frontend
npm run build
npm start
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker Deployment

```dockerfile
# 02_Web_Application/frontend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Start
CMD ["npm", "start"]
```

---

## Troubleshooting

### Issue: Component not found

**Solution:** Check import path and symlink/copy status

```bash
# Verify symlink
ls -la src/components

# Or verify copy
dir src\components
```

### Issue: Tailwind classes not working

**Solution:** Ensure Tailwind config imports from 05

```typescript
// tailwind.config.ts
export { default } from '../../05_UI_Design_System/Implementation/Web/tailwind.config.tokens';
```

### Issue: Type errors

**Solution:** Check tsconfig.json paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["../../../05_UI_Design_System/Implementation/Web/components/*"]
    }
  }
}
```

---

## Summary

**Strategy:**
```
05_UI_Design_System/Implementation/Web/
    ↓ DIRECT IMPORT
02_Web_Application/frontend/
```

**Key Points:**
- ✅ 100% component reuse from 05
- ✅ Zero adaptation needed
- ✅ Instant updates
- ✅ Add 02-specific features (API, auth, etc.)
- ❌ Don't duplicate components

**Result:** Consistent web application with shared design system!
