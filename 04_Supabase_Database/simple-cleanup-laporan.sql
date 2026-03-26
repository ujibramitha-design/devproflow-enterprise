-- Simple Cleanup for Laporan_progrees_unit
-- Run this SQL in Supabase SQL Editor

-- =====================================================
-- STEP 1: Check for duplicates first
-- =====================================================

SELECT 
    COUNT(*) as total_records
FROM "Laporan_progrees_unit";

-- Check duplicates based on common fields
SELECT 
    idunit,
    'nama customer',
    tanggal,
    status,
    COUNT(*) as duplicate_count,
    MIN(id) as keep_id,
    STRING_AGG(CAST(id AS TEXT), ', ') as duplicate_ids
FROM "Laporan_progrees_unit"
GROUP BY idunit, 'nama customer', tanggal, status
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- =====================================================
-- STEP 2: Create backup (IMPORTANT!)
-- =====================================================

CREATE TABLE "Laporan_progrees_unit_backup" AS 
SELECT * FROM "Laporan_progrees_unit";

-- =====================================================
-- STEP 3: Delete duplicates (keep first record)
-- =====================================================

DELETE FROM "Laporan_progrees_unit"
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY idunit, 'nama customer', tanggal, status 
                ORDER BY id ASC
            ) as row_num
        FROM "Laporan_progrees_unit"
    ) ranked
    WHERE row_num > 1
);

-- =====================================================
-- STEP 4: Verify cleanup
-- =====================================================

-- Check remaining records
SELECT 
    COUNT(*) as remaining_records
FROM "Laporan_progrees_unit";

-- Check backup records
SELECT 
    COUNT(*) as backup_records
FROM "Laporan_progrees_unit_backup";

-- Verify no more duplicates
SELECT 
    idunit,
    'nama customer',
    tanggal,
    status,
    COUNT(*) as count_after_cleanup
FROM "Laporan_progrees_unit"
GROUP BY idunit, 'nama customer', tanggal, status
HAVING COUNT(*) > 1;

-- =====================================================
-- STEP 5: Rollback (if needed)
-- =====================================================

-- To restore from backup:
-- TRUNCATE TABLE "Laporan_progrees_unit";
-- INSERT INTO "Laporan_progrees_unit" SELECT * FROM "Laporan_progrees_unit_backup";

-- =====================================================
-- NOTES
-- =====================================================

-- 1. Run STEP 1 first to see what duplicates exist
-- 2. Run STEP 2 to create backup
-- 3. Run STEP 3 to delete duplicates
-- 4. Run STEP 4 to verify cleanup
-- 5. Use STEP 5 only if you need to rollback
