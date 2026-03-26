-- Check "laporan_progres_unit" Table Status
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Check if table exists
-- =====================================================

SELECT 
    'Table exists check' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'laporan_progres_unit'
    ) as exists_check;

-- =====================================================
-- STEP 2: Check all variations of the table name
-- =====================================================

SELECT 
    table_name as variation,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name
        ) THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST'
    END as status
FROM (VALUES 
    ('laporan_progres_unit'),
    ('Laporan_progrees_unit'),
    ('laporan_progress_unit'),
    ('Laporan_progress_unit'),
    ('laporan_progres_unit_backup_before_delete'),
    ('Laporan_progrees_unit_backup_before_delete')
) AS t(table_name);

-- =====================================================
-- STEP 3: If table exists, check records
-- =====================================================

-- Check records if table exists (this will only run if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'laporan_progres_unit'
    ) THEN
        RAISE NOTICE 'Table laporan_progres_unit exists. Checking records...';
        
        -- Get record count
        EXECUTE 'SELECT COUNT(*) FROM "laporan_progres_unit"' INTO record_count;
        RAISE NOTICE 'Records in laporan_progres_unit: %', record_count;
        
        -- Show sample records
        EXECUTE 'SELECT * FROM "laporan_progres_unit" LIMIT 5' INTO sample_records;
        RAISE NOTICE 'Sample records: %', sample_records;
    ELSE
        RAISE NOTICE 'Table laporan_progres_unit does not exist';
    END IF;
END $$;

-- =====================================================
-- STEP 4: Check if table is in publication
-- =====================================================

SELECT 
    'Publication check' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
            AND tablename = 'laporan_progres_unit'
        ) THEN '✅ IN PUBLICATION'
        ELSE '❌ NOT IN PUBLICATION'
    END as publication_status;

-- =====================================================
-- STEP 5: Check related tables
-- =====================================================

SELECT 
    table_name,
    CASE 
        WHEN table_name ILIKE '%laporan%' THEN '📋 LAPORAN RELATED'
        ELSE '📄 OTHER'
    END as category,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables t
WHERE t.table_schema = 'public'
AND t.table_name ILIKE '%laporan%'
ORDER BY t.table_name;
