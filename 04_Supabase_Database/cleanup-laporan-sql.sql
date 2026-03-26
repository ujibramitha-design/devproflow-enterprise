-- Cleanup Duplicate Data - Laporan_progrees_unit
-- SQL script to identify and remove duplicate records

-- =====================================================
-- WARNING: This will delete data! Please backup first!
-- =====================================================

-- Step 1: Identify duplicates first
SELECT 
    unit_id,
    tanggal,
    status,
    COUNT(*) as duplicate_count,
    MIN(id) as keep_id,
    STRING_AGG(CAST(id AS TEXT), ', ') as all_ids
FROM "Laporan_progrees_unit"
GROUP BY unit_id, tanggal, status
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Create backup table (optional but recommended)
CREATE TABLE "Laporan_progrees_unit_backup" AS 
SELECT * FROM "Laporan_progrees_unit";

-- Step 3: Delete duplicates (keeping the first record based on minimum ID)
DELETE FROM "Laporan_progrees_unit"
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY unit_id, tanggal, status 
                ORDER BY id ASC
            ) as row_num
        FROM "Laporan_progrees_unit"
    ) ranked
    WHERE row_num > 1
);

-- Step 4: Verify cleanup
SELECT 
    unit_id,
    tanggal,
    status,
    COUNT(*) as count_after_cleanup
FROM "Laporan_progrees_unit"
GROUP BY unit_id, tanggal, status
HAVING COUNT(*) > 1;

-- Step 5: Check total records before and after
SELECT 
    'backup_table' as table_name,
    COUNT(*) as record_count
FROM "Laporan_progrees_unit_backup"

UNION ALL

SELECT 
    'main_table' as table_name,
    COUNT(*) as record_count
FROM "Laporan_progrees_unit";

-- =====================================================
-- Alternative: If table has different column names
-- =====================================================

-- If your table uses different column names, try these variations:

-- Variation 1: Using idunit instead of unit_id
SELECT 
    idunit,
    tanggal,
    status,
    COUNT(*) as duplicate_count,
    MIN(id) as keep_id
FROM "Laporan_progrees_unit"
GROUP BY idunit, tanggal, status
HAVING COUNT(*) > 1;

-- Variation 2: Using 'nama customer' or other fields
SELECT 
    idunit,
    'nama customer',
    'status unit',
    COUNT(*) as duplicate_count,
    MIN(id) as keep_id
FROM "Laporan_progrees_unit"
GROUP BY idunit, 'nama customer', 'status unit'
HAVING COUNT(*) > 1;

-- =====================================================
-- Rollback (if needed)
-- =====================================================

-- To restore from backup (if you created it)
-- TRUNCATE TABLE "Laporan_progrees_unit";
-- INSERT INTO "Laporan_progrees_unit" SELECT * FROM "Laporan_progrees_unit_backup";

-- =====================================================
-- Notes
-- =====================================================

-- 1. Always run the SELECT query first to see what will be deleted
-- 2. Create backup before running DELETE
-- 3. Test on a small subset first if possible
-- 4. Adjust column names based on your actual table structure
-- 5. The DELETE query keeps the record with the minimum ID for each duplicate group
