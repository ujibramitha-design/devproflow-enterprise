-- Enable JWT & RLS for Safe Table Deletion
-- Re-enable security to safely delete Laporan_progrees_unit table

-- =====================================================
-- STEP 1: Enable RLS on the table
-- =====================================================

-- Enable Row Level Security
ALTER TABLE "Laporan_progrees_unit" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: Create RLS Policies for Safe Access
-- =====================================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow all operations" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable read access for all users" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "Laporan_progrees_unit";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "Laporan_progrees_unit";

-- Create admin policy for full access (for deletion)
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
-- STEP 3: Verify RLS Status
-- =====================================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'Laporan_progrees_unit';

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'Laporan_progrees_unit';

-- =====================================================
-- STEP 4: Test Access (should work with proper auth)
-- =====================================================

-- This should work with proper authentication
SELECT COUNT(*) as total_records 
FROM "Laporan_progrees_unit";

-- =====================================================
-- STEP 5: Prepare for Deletion
-- =====================================================

-- Create backup before deletion (optional but recommended)
CREATE TABLE "Laporan_progrees_unit_backup_before_delete" AS 
SELECT * FROM "Laporan_progrees_unit";

-- Check what will be deleted
SELECT 
    'Records to be deleted' as action,
    COUNT(*) as count
FROM "Laporan_progrees_unit";

-- =====================================================
-- STEP 6: Delete the Table
-- =====================================================

-- Drop the table completely
DROP TABLE IF EXISTS "Laporan_progrees_unit" CASCADE;

-- =====================================================
-- STEP 7: Verify Deletion
-- =====================================================

-- Check if table exists
SELECT 
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit'
    ) as table_exists;

-- Check backup table exists
SELECT 
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Laporan_progrees_unit_backup_before_delete'
    ) as backup_exists;

-- =====================================================
-- STEP 8: Clean Up (Optional)
-- =====================================================

-- If you want to restore the table later, you can use:
-- CREATE TABLE "Laporan_progrees_unit" AS SELECT * FROM "Laporan_progrees_unit_backup_before_delete";

-- Or if you want to permanently delete the backup:
-- DROP TABLE IF EXISTS "Laporan_progrees_unit_backup_before_delete";

-- =====================================================
-- STEP 9: Disable RLS Again (if needed)
-- =====================================================

-- If you want to disable RLS again after deletion:
-- ALTER TABLE IF EXISTS "Laporan_progrees_unit" DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- NOTES
-- =====================================================

-- 1. This script re-enables RLS for safe deletion
-- 2. Creates admin policy for full access
-- 3. Creates backup before deletion
-- 4. Drops the table completely
-- 5. Verifies deletion
-- 6. You can restore from backup if needed
