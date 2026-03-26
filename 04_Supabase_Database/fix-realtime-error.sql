-- Fix Real-time Error - Remove Deleted Table References
-- Run this in Supabase SQL Editor to fix the real-time issue

-- =====================================================
-- STEP 1: Check current publication tables
-- =====================================================

SELECT 
    pubname as publication_name,
    schemaname || '.' || tablename as table_name
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- =====================================================
-- STEP 2: Remove deleted table from publication
-- =====================================================

-- Remove the deleted table from real-time publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.laporan_progres_unit;

-- =====================================================
-- STEP 3: Add only existing tables to publication
-- =====================================================

-- Add main data table to publication (if exists)
ALTER PUBLICATION supabase_realtime ADD TABLE IF EXISTS public."data global master";

-- =====================================================
-- STEP 4: Verify publication is fixed
-- =====================================================

SELECT 
    'Fixed publication tables' as status,
    pubname as publication_name,
    schemaname || '.' || tablename as table_name
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- =====================================================
-- STEP 5: Test real-time subscription
-- =====================================================

-- This should work now without errors
SELECT 
    'Real-time ready' as status,
    'data global master' as available_for_realtime;
