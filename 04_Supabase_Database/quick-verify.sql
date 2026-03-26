-- Quick Verification - Laporan_progrees_unit Deleted
-- Run this to confirm table is deleted

-- Check if table exists (should return false)
SELECT 
    'Laporan_progrees_unit exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- Check backup table (if created)
SELECT 
    'Backup table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit_backup_before_delete'
    ) as backup_exists;

-- List similar tables (if any)
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND (table_name ILIKE '%laporan%' OR table_name ILIKE '%progress%')
ORDER BY table_name;
