-- Simple Table Count - All Tables in Supabase
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Count all tables
-- =====================================================

SELECT 
    'Total tables' as metric,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public';

-- =====================================================
-- STEP 2: List all tables with details
-- =====================================================

SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_name = 'data global master' THEN 'MAIN DATA'
        WHEN table_name ILIKE '%laporan%' THEN 'LAPORAN TABLE'
        WHEN table_name ILIKE '%backup%' THEN 'BACKUP TABLE'
        WHEN table_name ILIKE '%user%' THEN 'USER TABLE'
        WHEN table_name ILIKE '%notification%' THEN 'NOTIFICATION TABLE'
        ELSE 'OTHER TABLE'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY category, table_name;

-- =====================================================
-- STEP 3: Check specific important tables
-- =====================================================

-- Check main data table
SELECT 
    'data global master' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'data global master'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status;

-- Check deleted table
SELECT 
    'Laporan_progrees_unit' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'Laporan_progrees_unit'
        ) THEN 'EXISTS'
        ELSE 'DELETED'
    END as status;

-- Check backup table
SELECT 
    'Laporan_progrees_unit_backup_before_delete' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'Laporan_progrees_unit_backup_before_delete'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status;

-- =====================================================
-- STEP 4: Count records in existing tables
-- =====================================================

-- Count main data records
SELECT 
    'data global master' as table_name,
    (SELECT COUNT(*) FROM "data global master") as record_count;

-- =====================================================
-- STEP 5: Check real-time publication
-- =====================================================

SELECT 
    pubname as publication_name,
    ALL TABLES schemaname || '.' || tablename as table_list
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
