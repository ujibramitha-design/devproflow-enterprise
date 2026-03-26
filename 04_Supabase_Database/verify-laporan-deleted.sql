-- Verify laporan_progres_unit Table is Deleted
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Check if table exists
-- =====================================================

SELECT 
    'laporan_progres_unit exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'laporan_progres_unit'
    ) as exists_check;

-- =====================================================
-- STEP 2: Check all variations
-- =====================================================

SELECT 
    'Table variations check' as status,
    table_name as variation,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name
        ) THEN 'EXISTS'
        ELSE 'DELETED'
    END as status
FROM (VALUES 
    ('laporan_progres_unit'),
    ('Laporan_progrees_unit'),
    ('laporan_progress_unit'),
    ('Laporan_progress_unit')
) AS t(table_name);

-- =====================================================
-- STEP 3: Check if still in publication (causing error)
-- =====================================================

SELECT 
    'Publication check' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
            AND tablename = 'laporan_progres_unit'
        ) THEN 'STILL IN PUBLICATION (CAUSING ERROR)'
        ELSE 'REMOVED FROM PUBLICATION'
    END as publication_status;

-- =====================================================
-- STEP 4: Show what tables actually exist
-- =====================================================

SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_name = 'data global master' THEN '🔹 MAIN DATA'
        WHEN table_name ILIKE '%laporan%' THEN '📋 LAPORAN'
        ELSE '📄 OTHER'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name = 'data global master' THEN 1
        WHEN table_name ILIKE '%laporan%' THEN 2
        ELSE 3
    END,
    table_name;
