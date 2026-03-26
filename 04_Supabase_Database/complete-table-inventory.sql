-- Complete Table Inventory - Supabase
-- Run this to see all tables and counts

-- =====================================================
-- TOTAL TABLE COUNT
-- =====================================================

SELECT 
    'TOTAL TABLES' as category,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public';

-- =====================================================
-- LIST ALL TABLES
-- =====================================================

SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_name = 'data global master' THEN '🔹 MAIN DATA'
        WHEN table_name ILIKE '%laporan%' THEN '📋 LAPORAN'
        WHEN table_name ILIKE '%backup%' THEN '💾 BACKUP'
        WHEN table_name ILIKE '%user%' THEN '👤 USER'
        WHEN table_name ILIKE '%notification%' THEN '📬 NOTIFICATION'
        WHEN table_name ILIKE '%audit%' THEN '🔍 AUDIT'
        ELSE '📄 OTHER'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name = 'data global master' THEN 1
        WHEN table_name ILIKE '%laporan%' THEN 2
        WHEN table_name ILIKE '%backup%' THEN 3
        ELSE 4
    END,
    table_name;

-- =====================================================
-- CHECK IMPORTANT TABLES
-- =====================================================

-- Main data table
SELECT 
    'data global master' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'data global master'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT COUNT(*) FROM "data global master"), 0) as record_count;

-- Deleted table check
SELECT 
    'Laporan_progrees_unit' as table_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'Laporan_progrees_unit'
        ) THEN '❌ STILL EXISTS'
        ELSE '✅ DELETED'
    END as status;

-- Alternative spellings check
SELECT 
    table_name as alternative_name,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM (VALUES 
    ('laporan_progres_unit'),
    ('laporan_progress_unit'),
    ('Laporan_progrees_unit_backup_before_delete')
) AS t(table_name);

-- =====================================================
-- RECORD COUNTS FOR EXISTING TABLES
-- =====================================================

-- Get record counts for all existing tables
SELECT 
    t.table_name,
    t.category,
    COALESCE(record_counts.record_count, 0) as record_count
FROM (
    SELECT 
        table_name,
        CASE 
            WHEN table_name = 'data global master' THEN '🔹 MAIN DATA'
            WHEN table_name ILIKE '%laporan%' THEN '📋 LAPORAN'
            WHEN table_name ILIKE '%backup%' THEN '💾 BACKUP'
            ELSE '📄 OTHER'
        END as category
    FROM information_schema.tables 
    WHERE table_schema = 'public'
) t
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) as record_count
    FROM (
        EXECUTE format('SELECT COUNT(*) FROM %I', t.table_name)
    ) counts
) record_counts ON true
ORDER BY t.category, t.table_name;
