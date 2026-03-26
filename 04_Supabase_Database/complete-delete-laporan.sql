-- COMPLETE DELETE: Laporan_progrees_unit Table
-- With JWT/RLS enabled for safe deletion
-- Copy entire file to Supabase SQL Editor and run all steps

-- =====================================================
-- STEP 1: Check Table Status
-- =====================================================

-- Check if table exists
SELECT 
    'Table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- Count records before deletion
SELECT 
    'Records before deletion' as status,
    COUNT(*) as count
FROM "Laporan_progrees_unit";

-- =====================================================
-- STEP 2: Enable RLS for Safe Deletion
-- =====================================================

-- Enable Row Level Security
ALTER TABLE "Laporan_progrees_unit" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable read access for all users" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "Laporan_progrees_unit";

-- Create admin policy for full access
CREATE POLICY "Admin full access on Laporan_progrees_unit" ON "Laporan_progrees_unit"
    FOR ALL
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'email' = 'admin@kprflow.com' OR
        auth.uid() IS NOT NULL
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'email' = 'admin@kprflow.com' OR
        auth.uid() IS NOT NULL
    );

-- =====================================================
-- STEP 3: Create Backup Before Deletion
-- =====================================================

-- Create backup table
CREATE TABLE "Laporan_progrees_unit_backup_before_delete" AS 
SELECT * FROM "Laporan_progrees_unit";

-- Verify backup created
SELECT 
    'Backup created' as status,
    COUNT(*) as backup_count
FROM "Laporan_progrees_unit_backup_before_delete";

-- =====================================================
-- STEP 4: Delete the Table
-- =====================================================

-- Drop the table completely
DROP TABLE IF EXISTS "Laporan_progrees_unit" CASCADE;

-- =====================================================
-- STEP 5: Verify Deletion
-- =====================================================

-- Check if original table exists
SELECT 
    'Original table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as exists_check;

-- Check backup table exists
SELECT 
    'Backup table exists' as status,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit_backup_before_delete'
    ) as exists_check;

-- Show backup records
SELECT 
    'Backup records count' as status,
    COUNT(*) as count
FROM "Laporan_progrees_unit_backup_before_delete";

-- =====================================================
-- STEP 6: Clean Up (Optional)
-- =====================================================

-- If you want to permanently delete the backup later:
-- DROP TABLE IF EXISTS "Laporan_progrees_unit_backup_before_delete";

-- =====================================================
-- STEP 7: Restore (If Needed Later)
-- =====================================================

-- To restore the table from backup later:
-- CREATE TABLE "Laporan_progrees_unit" AS 
-- SELECT * FROM "Laporan_progrees_unit_backup_before_delete";

-- =====================================================
-- SUMMARY
-- =====================================================

-- Final status check
SELECT 
    'DELETION COMPLETE' as action,
    'Laporan_progrees_unit' as table_name,
    'Backup available' as backup_status,
    'Table deleted' as deletion_status;

-- =====================================================
-- NOTES
-- =====================================================

-- 1. This script completely deletes the Laporan_progrees_unit table
-- 2. Creates backup before deletion for safety
-- 3. Enables RLS temporarily for safe deletion
-- 4. Verification steps included
-- 5. Can restore from backup if needed
-- 6. Backup table can be deleted later if not needed
