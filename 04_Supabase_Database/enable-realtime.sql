-- Enable Real-time for bramsray1 - KPRFlow Enterprise
-- SQL commands to enable real-time functionality

-- =====================================================
-- 1. ENABLE REAL-TIME PUBLICATION
-- =====================================================

-- Enable real-time for the main table
ALTER PUBLICATION supabase_realtime ADD TABLE "data global master";

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on the main table
ALTER TABLE "data global master" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE RLS POLICIES FOR REAL-TIME
-- =====================================================

-- Policy for anonymous users (read-only)
CREATE POLICY "Allow anonymous read access" ON "data global master"
    FOR SELECT USING (true);

-- Policy for authenticated users (full access)
CREATE POLICY "Allow authenticated full access" ON "data global master"
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for specific roles (if implemented)
CREATE POLICY "Allow marketing full access" ON "data global master"
    FOR ALL USING (auth.jwt() ->> 'role' = 'MARKETING');

CREATE POLICY "Allow finance read access" ON "data global master"
    FOR SELECT USING (auth.jwt() ->> 'role' = 'FINANCE');

CREATE POLICY "Allow legal full access" ON "data global master"
    FOR ALL USING (auth.jwt() ->> 'role' = 'LEGAL');

-- =====================================================
-- 4. CREATE REAL-TIME FUNCTIONS
-- =====================================================

-- Function to trigger real-time updates
CREATE OR REPLACE FUNCTION trigger_realtime_update()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called by triggers to ensure real-time updates
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CREATE TRIGGERS FOR REAL-TIME
-- =====================================================

-- Trigger for INSERT operations
CREATE TRIGGER trigger_insert_realtime
    AFTER INSERT ON "data global master"
    FOR EACH ROW
    EXECUTE FUNCTION trigger_realtime_update();

-- Trigger for UPDATE operations
CREATE TRIGGER trigger_update_realtime
    AFTER UPDATE ON "data global master"
    FOR EACH ROW
    EXECUTE FUNCTION trigger_realtime_update();

-- Trigger for DELETE operations
CREATE TRIGGER trigger_delete_realtime
    AFTER DELETE ON "data global master"
    FOR EACH ROW
    EXECUTE FUNCTION trigger_realtime_update();

-- =====================================================
-- 6. CREATE REAL-TIME VIEWS
-- =====================================================

-- View for real-time monitoring
CREATE OR REPLACE VIEW realtime_data_master AS
SELECT 
    id,
    "id unit",
    "nama customer",
    "status unit",
    "bank final",
    "plafon",
    "cair",
    "wa cust",
    "email cust",
    "timestamp",
    "updated_at"
FROM "data global master"
ORDER BY "updated_at" DESC;

-- =====================================================
-- 7. CREATE REAL-TIME INDEXES
-- =====================================================

-- Index for better real-time performance
CREATE INDEX IF NOT EXISTS idx_realtime_unit_id ON "data global master"("id unit");
CREATE INDEX IF NOT EXISTS idx_realtime_status ON "data global master"("status unit");
CREATE INDEX IF NOT EXISTS idx_realtime_updated_at ON "data global master"("updated_at");

-- =====================================================
-- 8. CREATE REAL-TIME STATISTICS
-- =====================================================

-- Function to get real-time statistics
CREATE OR REPLACE FUNCTION get_realtime_stats()
RETURNS TABLE (
    total_units INTEGER,
    available_units INTEGER,
    sold_units INTEGER,
    reserved_units INTEGER,
    processing_units INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_units,
        COUNT(*) FILTER (WHERE "status unit" = 'AVAILABLE') as available_units,
        COUNT(*) FILTER (WHERE "status unit" = 'SOLD') as sold_units,
        COUNT(*) FILTER (WHERE "status unit" = 'RESERVED') as reserved_units,
        COUNT(*) FILTER (WHERE "status unit" = 'PROCESSING') as processing_units,
        MAX("updated_at") as last_updated
    FROM "data global master";
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. CREATE REAL-TIME NOTIFICATIONS
-- =====================================================

-- Function to send real-time notifications
CREATE OR REPLACE FUNCTION send_realtime_notification(
    p_unit_id VARCHAR(50),
    p_event_type VARCHAR(50),
    p_message TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- This function can be extended to send notifications
    -- to external systems or internal notification tables
    
    -- Log the notification
    INSERT INTO notification_logs (unit_id, event_type, message, created_at)
    VALUES (p_unit_id, p_event_type, p_message, NOW())
    ON CONFLICT (unit_id, event_type) DO UPDATE SET
        message = EXCLUDED.message,
        created_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. CREATE NOTIFICATION LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id VARCHAR(50),
    event_type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE
);

-- Enable RLS for notification logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification logs
CREATE POLICY "Allow all access to notification logs" ON notification_logs
    FOR ALL USING (true);

-- Create indexes for notification logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_unit_id ON notification_logs(unit_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);

-- =====================================================
-- 11. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions for real-time access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON "data global master" TO anon, authenticated;
GRANT SELECT ON realtime_data_master TO anon, authenticated;
GRANT SELECT ON notification_logs TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_realtime_stats() TO anon, authenticated;

-- =====================================================
-- 12. VERIFY SETUP
-- =====================================================

-- Check if real-time is enabled
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'data global master';

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'data global master';

-- =====================================================
-- 13. SAMPLE REAL-TIME QUERIES
-- =====================================================

-- Test real-time subscription
-- This should be used in client applications
/*
const subscription = supabase
    .channel('data-global-master')
    .on('postgres_changes', 
        { 
            event: '*', 
            schema: 'public', 
            table: 'data global master' 
        }, 
        (payload) => {
            console.log('Real-time change:', payload);
        }
    )
    .subscribe();
*/

-- Test real-time statistics
-- SELECT * FROM get_realtime_stats();

-- Test real-time notifications
-- SELECT send_realtime_notification('D28-07', 'STATUS_CHANGE', 'Unit status changed to SOLD');

-- =====================================================
-- 14. CLEANUP FUNCTIONS (if needed)
-- =====================================================

-- Function to remove real-time setup (if needed)
/*
-- Drop triggers
DROP TRIGGER IF EXISTS trigger_insert_realtime ON "data global master";
DROP TRIGGER IF EXISTS trigger_update_realtime ON "data global master";
DROP TRIGGER IF EXISTS trigger_delete_realtime ON "data global master";

-- Drop function
DROP FUNCTION IF EXISTS trigger_realtime_update();

-- Drop policies
DROP POLICY IF EXISTS "Allow anonymous read access" ON "data global master";
DROP POLICY IF EXISTS "Allow authenticated full access" ON "data global master";
DROP POLICY IF EXISTS "Allow marketing full access" ON "data global master";
DROP POLICY IF EXISTS "Allow finance read access" ON "data global master";
DROP POLICY IF EXISTS "Allow legal full access" ON "data global master";

-- Disable RLS
ALTER TABLE "data global master" DISABLE ROW LEVEL SECURITY;

-- Remove from publication
ALTER PUBLICATION supabase_realtime DROP TABLE "data global master";
*/
