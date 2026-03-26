-- Quick Supabase Status Check
-- See what's still in your Supabase

-- =====================================================
-- STEP 1: Check Main Data Table
-- =====================================================

SELECT 
    'Main data table' as status,
    COUNT(*) as record_count
FROM "data global master";

-- =====================================================
-- STEP 2: Check Deleted Table Status
-- =====================================================

SELECT 
    'Laporan_progrees_unit exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- =====================================================
-- STEP 3: Check Backup Table
-- =====================================================

SELECT 
    'Backup table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit_backup_before_delete'
    ) as exists_check;

-- =====================================================
-- STEP 4: List All Tables
-- =====================================================

SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_name = 'data global master' THEN 'MAIN DATA'
        WHEN table_name ILIKE '%laporan%' THEN 'LAPORAN TABLE'
        WHEN table_name ILIKE '%backup%' THEN 'BACKUP TABLE'
        ELSE 'OTHER TABLE'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY category, table_name;

-- =====================================================
-- STEP 5: Check Recent Activity
-- =====================================================

-- Check if there are any recent records in main table
SELECT 
    'Recent records in main table' as status,
    COUNT(*) as count
FROM "data global master"
WHERE created_at >= NOW() - INTERVAL '7 days'
OR updated_at >= NOW() - INTERVAL '7 days';
