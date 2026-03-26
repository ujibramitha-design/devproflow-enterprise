-- Verify Laporan_progrees_unit Table Deletion
-- Check if table is already deleted

-- =====================================================
-- STEP 1: Check if table exists
-- =====================================================

SELECT 
    'Table exists check' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- =====================================================
-- STEP 2: Check backup table
-- =====================================================

SELECT 
    'Backup table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit_backup_before_delete'
    ) as backup_exists;

-- =====================================================
-- STEP 3: Check all tables (to see what exists)
-- =====================================================

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name ILIKE '%laporan%'
ORDER BY table_name;

-- =====================================================
-- STEP 4: Check if backup has data
-- =====================================================

SELECT 
    'Backup records count' as status,
    COUNT(*) as count
FROM "Laporan_progrees_unit_backup_before_delete"
WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'Laporan_progrees_unit_backup_before_delete'
);

-- =====================================================
-- STEP 5: List all tables in database
-- =====================================================

SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_name ILIKE '%laporan%' THEN 'LAPORAN_TABLE'
        WHEN table_name ILIKE '%progress%' THEN 'PROGRESS_TABLE'
        ELSE 'OTHER_TABLE'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY category, table_name;
