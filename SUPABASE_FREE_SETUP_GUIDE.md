# Supabase Free Setup Guide

## 🎯 STEP 3: SETUP SUPABASE FREE ACCOUNT

### **🗄️ SUPABASE ACCOUNT CREATION:**

#### **📋 LANGKAH-LANGKAH:**

**1. Sign Up Supabase**
```
URL: https://supabase.com
Click "Start your project"
Sign up with GitHub or Google
```

**2. Create New Project**
```
- Click "New Project"
- Organization: Create new organization (free)
- Project Name: kprflow-enterprise
- Database Password: Create strong password
- Region: Choose nearest region (Southeast Asia)
- Click "Create new project"
```

**3. Wait for Setup**
```
- Database setup: 1-2 minutes
- Project URL: Will be generated
- API Keys: Will be generated
- Save credentials securely
```

**4. Get Project Credentials**
```
Project URL: https://your-project-id.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **✅ SUPABASE FREE TIER BENEFITS:**

#### **🎯 FREE FEATURES:**
- **Database**: PostgreSQL 15+ (500MB storage)
- **Authentication**: Enterprise auth system
- **Real-time**: WebSocket connections
- **Storage**: 1GB file storage
- **Edge Functions**: 500ms/month
- **Row Level Security**: Enterprise security
- **API**: RESTful API + GraphQL

#### **📊 LIMITS:**
- **Database**: 500MB storage
- **Bandwidth**: 50GB/month
- **Active Users**: 50,000
- **Concurrent Connections**: 100
- **API Calls**: 50,000/day
- **File Storage**: 1GB
- **Edge Functions**: 500ms/month

---

## 🗄️ DATABASE SETUP

### **📋 CREATE TABLES:**

#### **1. Applications Table**
```sql
-- Create applications table
CREATE TABLE kpr_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  unit_id UUID REFERENCES units(id),
  bank_id UUID REFERENCES banks(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  data JSONB
);

-- Create indexes
CREATE INDEX idx_applications_status ON kpr_applications(status);
CREATE INDEX idx_applications_customer ON kpr_applications(customer_id);
CREATE INDEX idx_applications_created ON kpr_applications(created_at);
```

#### **2. Customers Table**
```sql
-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  nik TEXT UNIQUE NOT NULL,
  npwp TEXT,
  birth_date DATE,
  birth_place TEXT,
  address_ktp TEXT NOT NULL,
  address_domisili TEXT NOT NULL,
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  occupation TEXT,
  monthly_income DECIMAL(12,2),
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_nik ON customers(nik);
```

#### **3. Units Table**
```sql
-- Create units table
CREATE TABLE units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  type TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'available',
  description TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_units_block ON units(block);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_type ON units(type);
```

#### **4. Banks Table**
```sql
-- Create banks table
CREATE TABLE banks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  contact_info JSONB,
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_banks_name ON banks(name);
CREATE INDEX idx_banks_code ON banks(code);
```

---

## 🔐 AUTHENTICATION SETUP

### **📋 ENABLE AUTHENTICATION:**

#### **1. Configure Auth Settings**
```
Go to: Authentication -> Settings
- Site URL: https://kprflow.tk
- Redirect URLs: https://kprflow.tk/auth/callback
- Enable email signup
- Enable phone signup
- Disable social providers (for now)
```

#### **2. Create Auth Policies**
```sql
-- Enable RLS for all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpr_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Public read access for units and banks
CREATE POLICY "Public read access" ON units FOR SELECT USING (true);
CREATE POLICY "Public read access" ON banks FOR SELECT USING (true);

-- Users can only access their own data
CREATE POLICY "Users can view own applications" ON kpr_applications FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can insert own applications" ON kpr_applications FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own applications" ON kpr_applications FOR UPDATE USING (auth.uid() = customer_id);

-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON customers FOR UPDATE USING (auth.uid() = id);
```

---

## 🚀 API CONFIGURATION

### **📋 ENVIRONMENT VARIABLES:**

#### **For Vercel Deployment:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://kprflow.tk
NEXT_PUBLIC_APP_NAME=KPRFlow Enterprise
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### **For Local Development:**
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 DATABASE SEEDING

### **📋 SAMPLE DATA:**

#### **1. Insert Sample Banks**
```sql
INSERT INTO banks (name, code, contact_info, requirements) VALUES
('BCA', '014', '{"phone": "1500", "email": "support@bca.co.id"}', '{"min_income": 3000000, "max_loan": 500000000}'),
('BNI', '009', '{"phone": "1500", "email": "support@bni.co.id"}', '{"min_income": 3500000, "max_loan": 600000000}'),
('BRI', '002', '{"phone": "1500", "email": "support@bri.co.id"}', '{"min_income": 2500000, "max_loan": 400000000}'),
('Mandiri', '008', '{"phone": "1500", "email": "support@mandiri.co.id"}', '{"min_income": 4000000, "max_loan": 700000000}');
```

#### **2. Insert Sample Units**
```sql
INSERT INTO units (block, unit_number, type, price, status, description, specifications) VALUES
('A', '101', 'Type A', 500000000, 'available', '2 Bedroom, 1 Bathroom', '{"bedrooms": 2, "bathrooms": 1, "area": 45}'),
('A', '102', 'Type A', 500000000, 'available', '2 Bedroom, 1 Bathroom', '{"bedrooms": 2, "bathrooms": 1, "area": 45}'),
('B', '201', 'Type B', 750000000, 'available', '3 Bedroom, 2 Bathroom', '{"bedrooms": 3, "bathrooms": 2, "area": 65}'),
('B', '202', 'Type B', 750000000, 'sold', '3 Bedroom, 2 Bathroom', '{"bedrooms": 3, "bathrooms": 2, "area": 65}'),
('C', '301', 'Type C', 1000000000, 'available', '4 Bedroom, 3 Bathroom', '{"bedrooms": 4, "bathrooms": 3, "area": 85}');
```

---

## 🔍 TESTING CONNECTION

### **📋 VERIFY SETUP:**

#### **1. Test Database Connection**
```javascript
// Test connection in browser console
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-key'
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('banks').select('*');
    console.log('Connection successful:', data);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
```

#### **2. Test Authentication**
```javascript
// Test auth flow
async function testAuth() {
  try {
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('Auth test:', data);
  } catch (error) {
    console.error('Auth test failed:', error);
  }
}

testAuth();
```

---

## 📊 SETUP STATUS CHECKLIST

- [ ] Supabase account created
- [ ] Project created successfully
- [ ] Database tables created
- [ ] Authentication configured
- [ ] RLS policies implemented
- [ ] Sample data inserted
- [ ] API keys obtained
- [ ] Environment variables configured
- [ ] Connection tested successfully

---

## 🔧 TROUBLESHOOTING

### **❌ COMMON ISSUES:**

#### **Connection Failed:**
```bash
# Check API keys
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test with curl
curl -X POST "https://your-project-id.supabase.co/rest/v1/banks" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

#### **RLS Policy Issues:**
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Disable RLS temporarily for testing
ALTER TABLE banks DISABLE ROW LEVEL SECURITY;
```

#### **Performance Issues:**
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM kpr_applications WHERE status = 'pending';

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_applications_status_created ON kpr_applications(status, created_at);
```

---

## 🎯 NEXT STEPS

**Setelah Supabase setup selesai:**
1. Deploy web application ke Vercel
2. Connect custom domain (kprflow.tk)
3. Test complete integration
4. Test authentication flow
5. Verify all API endpoints

---

## ⚠️ IMPORTANT NOTES

- **Free Tier**: 500MB database, 50GB bandwidth
- **Backup**: Automatic backup included
- **SSL**: Automatic SSL certificate
- **Scaling**: Easy upgrade to paid tier
- **Support**: Community support free
- **Security**: Enterprise-grade security included
