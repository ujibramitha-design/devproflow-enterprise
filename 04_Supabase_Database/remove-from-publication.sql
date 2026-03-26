-- Remove laporan_progres_unit from Publication
-- Fix the real-time error

-- =====================================================
-- STEP 1: Remove from publication
-- =====================================================

ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.laporan_progres_unit;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public."Laporan_progrees_unit";

-- =====================================================
-- STEP 2: Verify removal
-- =====================================================

SELECT 
    'Publication status after fix' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
            AND tablename = 'laporan_progres_unit'
        ) THEN 'STILL IN PUBLICATION'
        ELSE 'SUCCESSFULLY REMOVED'
    END as publication_status;

-- =====================================================
-- STEP 3: Show remaining publication tables
-- =====================================================

SELECT 
    'Remaining publication tables' as status,
    pubname as publication_name,
    schemaname || '.' || tablename as table_name
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
