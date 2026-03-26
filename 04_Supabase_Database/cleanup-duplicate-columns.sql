-- =====================================================
-- KPRFlow Enterprise - Delete Duplicate Columns
-- Remove duplicate aging columns from data global master table
-- =====================================================

-- Check current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'data global master'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Remove duplicate columns (keep the correct ones)
-- Keep: aging_hari (111), aging_fisik (107)
-- Remove: aging hari (108), aging fisik (110)

-- Option 1: Delete duplicate columns
ALTER TABLE "data global master"
DROP COLUMN IF EXISTS "aging fisik",
DROP COLUMN IF EXISTS "aging hari";

-- Option 2: If you prefer to keep the first ones and rename
-- Uncomment below if you want to keep the first occurrence

/*
-- Rename columns to single naming convention
ALTER TABLE "data global master"
RENAME COLUMN "aging_fisik" TO "aging_fisik_old";

ALTER TABLE "data global master"
RENAME COLUMN "aging_hari" TO "aging_hari_old";

-- Then drop the duplicates
ALTER TABLE "data global master"
DROP COLUMN IF EXISTS "aging fisik",
DROP COLUMN IF EXISTS "aging hari";

-- Rename back to original names
ALTER TABLE "data global master"
RENAME COLUMN "aging_fisik_old" TO "aging_fisik";
ALTER TABLE "data global master"
RENAME COLUMN "aging_hari_old" TO "aging_hari";
*/

-- Verify cleanup
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'data global master'
AND table_schema = 'public'
AND column_name IN ('aging_fisik', 'aging_hari')
ORDER BY ordinal_position;

-- Update any views that might reference duplicate columns
-- Check for views
SELECT viewname, viewowner, definition
FROM pg_views
WHERE viewname LIKE '%aging%'
OR definition LIKE '%aging%';

-- Update view definitions if needed (example)
-- CREATE OR REPLACE VIEW v_unit_summary AS
-- SELECT 
--     id_unit,
--     nama_customer,
--     status_unit,
--     aging_hari,
--     progres_rumah,
--     harga_jual_dpp
-- FROM "data global master";

-- Update application code to use correct column names
-- Update JavaScript/TypeScript files to use:
-- - aging_hari (not "aging hari")
-- - aging_fisik (not "aging fisik")

-- Final verification
SELECT COUNT(*) as total_records,
       COUNT(CASE WHEN aging_hari IS NOT NULL THEN 1 END) as has_aging_hari,
       COUNT(CASE WHEN aging_fisik IS NOT NULL THEN 1 END) as has_aging_fisik
FROM "data global master";

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Duplicate columns cleanup completed successfully!';
    RAISE NOTICE 'Table: data global master';
    RAISE NOTICE 'Records: ' || (SELECT COUNT(*) FROM "data global master");
    RAISE NOTICE 'Columns after cleanup: ' || (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'data global master' AND table_schema = 'public');
END $$;
