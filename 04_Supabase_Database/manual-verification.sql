-- Manual Verification - Your Supabase Status
-- Run this in Supabase SQL Editor

-- Check main data table
SELECT 
    'Main data table' as status,
    COUNT(*) as record_count
FROM "data global master";

-- Check deleted table (should return false)
SELECT 
    'Laporan_progrees_unit exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- List all your tables
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'data global master' THEN 'MAIN DATA'
        WHEN table_name ILIKE '%backup%' THEN 'BACKUP'
        ELSE 'OTHER'
    END as category
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
