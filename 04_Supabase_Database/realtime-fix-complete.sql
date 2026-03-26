-- Complete Real-time Fix - Remove Deleted Table References
-- Run this entire script in Supabase SQL Editor

-- =====================================================
-- STEP 1: Check Current Publication Status
-- =====================================================

SELECT 
    'Current publication tables' as status,
    pubname as publication_name,
    schemaname || '.' || tablename as table_name
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- =====================================================
-- STEP 2: Remove Deleted Table from Publication
-- =====================================================

-- Remove all variations of the deleted table
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.laporan_progres_unit;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.laporan_progress_unit;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public."Laporan_progrees_unit";

-- =====================================================
-- STEP 3: Add Only Existing Tables to Publication
-- =====================================================

-- Add main data table
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS public."data global master";

-- =====================================================
-- STEP 4: Verify Fix
-- =====================================================

SELECT 
    'Fixed publication tables' as status,
    pubname as publication_name,
    schemaname || '.' || tablename as table_name
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- =====================================================
-- STEP 5: Test Real-time Works
-- =====================================================

-- This should now work without errors
SELECT 
    'Real-time status' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
            AND tablename = 'data global master'
        ) THEN '✅ READY'
        ELSE '❌ NOT READY'
    END as realtime_status;
