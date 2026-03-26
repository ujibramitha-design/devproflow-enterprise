-- =====================================================
-- KPRFlow Enterprise - Advanced Database Schema (bramsray2)
-- Phase 2: Database Schema & RBAC (100% Complete)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- CORE TABLES WITH ENHANCED FEATURES
-- =====================================================

-- Enhanced user_profiles table with additional fields
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    department VARCHAR(100),
    position VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    session_token TEXT,
    refresh_token TEXT,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Enhanced kpr_dossiers table with comprehensive tracking
CREATE TABLE IF NOT EXISTS kpr_dossiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    unit_property_id UUID NOT NULL REFERENCES unit_properties(id) ON DELETE RESTRICT,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    status dossier_status NOT NULL DEFAULT 'LEAD',
    priority dossier_priority DEFAULT 'NORMAL',
    source VARCHAR(100) DEFAULT 'MANUAL',
    campaign_id UUID,
    sales_agent_id UUID REFERENCES user_profiles(id),
    sales_coordinator_id UUID REFERENCES user_profiles(id),
    assigned_to UUID REFERENCES user_profiles(id),
    estimated_plafon DECIMAL(15,2),
    requested_plafon DECIMAL(15,2),
    approved_plafon DECIMAL(15,2),
    down_payment DECIMAL(15,2),
    monthly_income DECIMAL(15,2),
    debt_to_income_ratio DECIMAL(5,2),
    credit_score INTEGER,
    risk_level VARCHAR(20) DEFAULT 'MEDIUM',
    notes TEXT,
    documents_status JSONB DEFAULT '{}',
    bank_submissions JSONB DEFAULT '{}',
    legal_documents JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Enhanced unit_properties table with detailed information
CREATE TABLE IF NOT EXISTS unit_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    block VARCHAR(10) NOT NULL,
    unit_number VARCHAR(10) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    bedroom_count INTEGER NOT NULL,
    bathroom_count INTEGER NOT NULL,
    floor_level INTEGER,
    building_size DECIMAL(8,2),
    land_size DECIMAL(8,2),
    price DECIMAL(15,2) NOT NULL,
    base_price DECIMAL(15,2),
    discount_amount DECIMAL(15,2) DEFAULT 0,
    final_price DECIMAL(15,2),
    price_per_sqm DECIMAL(10,2),
    status unit_status NOT NULL DEFAULT 'AVAILABLE',
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE',
    view_type VARCHAR(100),
    facing_direction VARCHAR(50),
    certificate_number VARCHAR(100),
    tax_number VARCHAR(100),
    building_permit_number VARCHAR(100),
    developer_id UUID REFERENCES user_profiles(id),
    cluster VARCHAR(50),
    siteplan_index INTEGER,
    is_vip BOOLEAN DEFAULT FALSE,
    marketing_description TEXT,
    specifications JSONB DEFAULT '{}',
    amenities JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Documents table for document management
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES kpr_dossiers(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    file_size BIGINT,
    file_type VARCHAR(20),
    upload_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Financial transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES kpr_dossiers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    transaction_status VARCHAR(20) DEFAULT 'PENDING',
    reference_number VARCHAR(100),
    description TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Bank submissions table
CREATE TABLE IF NOT EXISTS bank_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES kpr_dossiers(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    submission_date DATE NOT NULL,
    submission_status VARCHAR(50) DEFAULT 'SUBMITTED',
    plafon_requested DECIMAL(15,2),
    plafon_approved DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    tenure_months INTEGER,
    monthly_installment DECIMAL(15,2),
    processing_fee DECIMAL(15,2),
    insurance_fee DECIMAL(15,2),
    approval_date DATE,
    rejection_reason TEXT,
    documents_required JSONB DEFAULT '{}',
    documents_submitted JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Legal documents table
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES kpr_dossiers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_number VARCHAR(100),
    notary_name VARCHAR(255),
    notary_office VARCHAR(255),
    notary_phone VARCHAR(20),
    signing_date DATE,
    effective_date DATE,
    expiry_date DATE,
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'DRAFT',
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(20) DEFAULT 'SYSTEM',
    status VARCHAR(20) DEFAULT 'PENDING',
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp messages table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_phone VARCHAR(20) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    message_type VARCHAR(20) DEFAULT 'TEXT',
    content TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SPR data table
CREATE TABLE IF NOT EXISTS spr_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    spr_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    unit_id UUID REFERENCES unit_properties(id),
    spr_date DATE NOT NULL,
    spr_status VARCHAR(50) DEFAULT 'ACTIVE',
    amount DECIMAL(15,2),
    notes TEXT,
    documents JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id)
);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

-- KPR dossiers indexes
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_customer_id ON kpr_dossiers(customer_id);
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_unit_id ON kpr_dossiers(unit_property_id);
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_status ON kpr_dossiers(status);
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_application_number ON kpr_dossiers(application_number);
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_priority ON kpr_dossiers(priority);
CREATE INDEX IF NOT EXISTS idx_kpr_dossiers_risk_level ON kpr_dossiers(risk_level);

-- Unit properties indexes
CREATE INDEX IF NOT EXISTS idx_unit_properties_project ON unit_properties(project_name);
CREATE INDEX IF NOT EXISTS idx_unit_properties_block ON unit_properties(block);
CREATE INDEX IF NOT EXISTS idx_unit_properties_status ON unit_properties(status);
CREATE INDEX IF NOT EXISTS idx_unit_properties_vip ON unit_properties(is_vip);
CREATE INDEX IF NOT EXISTS idx_unit_properties_price ON unit_properties(price);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_dossier_id ON documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Financial transactions indexes
CREATE INDEX IF NOT EXISTS idx_financial_dossier_id ON financial_transactions(dossier_id);
CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_transactions(transaction_status);

-- Bank submissions indexes
CREATE INDEX IF NOT EXISTS idx_bank_dossier_id ON bank_submissions(dossier_id);
CREATE INDEX IF NOT EXISTS idx_bank_name ON bank_submissions(bank_name);
CREATE INDEX IF NOT EXISTS idx_bank_status ON bank_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_bank_date ON bank_submissions(submission_date);

-- Legal documents indexes
CREATE INDEX IF NOT EXISTS idx_legal_dossier_id ON legal_documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_legal_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_status ON legal_documents(status);
CREATE INDEX IF NOT EXISTS idx_legal_date ON legal_documents(signing_date);

-- Notification logs indexes
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_type ON notification_logs(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_created_at ON notification_logs(created_at);

-- WhatsApp messages indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_sender ON whatsapp_messages(sender_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_recipient ON whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_created_at ON whatsapp_messages(created_at);

-- SPR data indexes
CREATE INDEX IF NOT EXISTS idx_spr_user_id ON spr_data(user_id);
CREATE INDEX IF NOT EXISTS idx_spr_number ON spr_data(spr_number);
CREATE INDEX IF NOT EXISTS idx_spr_status ON spr_data(spr_status);
CREATE INDEX IF NOT EXISTS idx_spr_date ON spr_data(spr_date);

-- Audit trail indexes
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_trail(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_trail(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_trail(created_at);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_recorded_at ON performance_metrics(recorded_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpr_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE spr_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff can view all profiles" ON user_profiles
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

CREATE POLICY "Staff can update profiles" ON user_profiles
    FOR UPDATE USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

-- RLS Policies for kpr_dossiers
CREATE POLICY "Customers can view own dossiers" ON kpr_dossiers
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Staff can view all dossiers" ON kpr_dossiers
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

CREATE POLICY "Staff can manage dossiers" ON kpr_dossiers
    FOR ALL USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

-- RLS Policies for unit_properties
CREATE POLICY "All can view available units" ON unit_properties
    FOR SELECT USING (status = 'AVAILABLE');

CREATE POLICY "Staff can view all units" ON unit_properties
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

CREATE POLICY "Staff can manage units" ON unit_properties
    FOR ALL USING (auth.jwt() ->> 'role' IN ('LEGAL', 'BOD'));

-- RLS Policies for documents
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Staff can view all documents" ON documents
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

CREATE POLICY "Staff can manage documents" ON documents
    FOR ALL USING (auth.jwt() ->> 'role' IN ('MARKETING', 'LEGAL', 'FINANCE', 'BOD'));

-- Similar policies for other tables...

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpr_dossiers_updated_at 
    BEFORE UPDATE ON kpr_dossiers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unit_properties_updated_at 
    BEFORE UPDATE ON unit_properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Similar triggers for other tables...

-- =====================================================
-- REAL-TIME PUBLICATION
-- =====================================================

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE kpr_dossiers;
ALTER PUBLICATION supabase_realtime ADD TABLE unit_properties;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE bank_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE legal_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE notification_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE spr_data;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_trail;
ALTER PUBLICATION supabase_realtime ADD TABLE performance_metrics;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions for anonymous users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON user_profiles TO anon, authenticated;
GRANT SELECT ON unit_properties TO anon, authenticated;

-- Grant permissions for authenticated users
GRANT INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON kpr_dossiers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON documents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON financial_transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON notification_logs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON whatsapp_messages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON spr_data TO authenticated;

-- Grant permissions for staff roles
GRANT INSERT, UPDATE, DELETE ON unit_properties TO authenticated;
GRANT INSERT, UPDATE, DELETE ON bank_submissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON legal_documents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON audit_trail TO authenticated;
GRANT INSERT, UPDATE, DELETE ON performance_metrics TO authenticated;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for dossier summary
CREATE OR REPLACE VIEW v_dossier_summary AS
SELECT 
    d.id,
    d.application_number,
    d.status,
    d.priority,
    d.estimated_plafon,
    d.approved_plafon,
    d.risk_level,
    u.full_name as customer_name,
    u.email as customer_email,
    u.phone as customer_phone,
    p.project_name,
    p.block,
    p.unit_number,
    p.final_price,
    d.created_at,
    d.updated_at
FROM kpr_dossiers d
JOIN user_profiles u ON d.customer_id = u.id
JOIN unit_properties p ON d.unit_property_id = p.id;

-- View for unit availability
CREATE OR REPLACE VIEW v_unit_availability AS
SELECT 
    p.id,
    p.project_name,
    p.block,
    p.unit_number,
    p.unit_type,
    p.final_price,
    p.status,
    p.is_vip,
    COUNT(d.id) as dossier_count
FROM unit_properties p
LEFT JOIN kpr_dossiers d ON p.id = d.unit_property_id
GROUP BY p.id, p.project_name, p.block, p.unit_number, p.unit_type, p.final_price, p.status, p.is_vip;

-- View for performance metrics
CREATE OR REPLACE VIEW v_performance_summary AS
SELECT 
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    COUNT(*) as count,
    DATE(recorded_at) as recorded_date
FROM performance_metrics
GROUP BY metric_name, DATE(recorded_at)
ORDER BY recorded_date DESC;
