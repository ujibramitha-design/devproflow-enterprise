-- Check Duplicates in Laporan_progrees_unit
-- Run this first to see what duplicates exist

-- Total records
SELECT 
    'Total Records' as metric,
    COUNT(*) as count
FROM "Laporan_progrees_unit";

-- Check for duplicates based on common fields
SELECT 
    'Duplicate Groups' as metric,
    COUNT(*) as count
FROM (
    SELECT 
        idunit,
        'nama customer',
        tanggal,
        status
    FROM "Laporan_progrees_unit"
    GROUP BY idunit, 'nama customer', tanggal, status
    HAVING COUNT(*) > 1
) duplicates;

-- Show duplicate details
SELECT 
    idunit,
    'nama customer',
    tanggal,
    status,
    COUNT(*) as duplicate_count,
    MIN(id) as keep_id,
    STRING_AGG(CAST(id AS TEXT), ', ') as all_duplicate_ids
FROM "Laporan_progrees_unit"
GROUP BY idunit, 'nama customer', tanggal, status
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
