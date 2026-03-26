-- SQL Editor Examples - KPRFlow Enterprise
-- Cara mengubah data langsung di SQL Editor Supabase

-- =====================================================
-- 1. UPDATE SINGLE RECORD
-- =====================================================

-- Update status unit tertentu
UPDATE "data global master" 
SET "status unit" = 'SOLD', 
    "bank final" = 'BJB',
    "plafon" = 350000000,
    "cair" = 350000000
WHERE "id unit" = 'D28-07';

-- Update customer information
UPDATE "data global master" 
SET "nama customer" = 'John Doe Updated',
    "wa cust" = '+628123456789',
    "email cust" = 'john.doe@example.com'
WHERE "id unit" = 'D27-16';

-- =====================================================
-- 2. BATCH UPDATE MULTIPLE RECORDS
-- =====================================================

-- Update semua unit dengan status LEAD menjadi PROCESSING
UPDATE "data global master" 
SET "status unit" = 'PROCESSING',
    "proses pemberkasan" = 'IN PROGRESS'
WHERE "status unit" = 'LEAD';

-- Update harga untuk semua unit di cluster D28
UPDATE "data global master" 
SET "harga jual dpp" = "harga jual dpp" * 1.1,
    "plafon" = "plafon" * 1.1
WHERE "blok" = 'D28';

-- =====================================================
-- 3. CONDITIONAL UPDATE
-- =====================================================

-- Update VIP units (5 unit sakti)
UPDATE "data global master" 
SET "jenis produk" = 'semikomersil',
    "status unit" = 'RESERVED'
WHERE "id unit" IN ('D28-07', 'D27-16', 'D28-02', 'E01-01', 'E01-02');

-- Update units dengan plafon > 500jt
UPDATE "data global master" 
SET "status unit" = 'PREMIUM',
    "potensi app" = 'HIGH'
WHERE "plafon" > 500000000;

-- =====================================================
-- 4. UPDATE WITH SUBQUERY
-- =====================================================

-- Update aging berdasarkan tgl spr
UPDATE "data global master" 
SET "aging hari" = EXTRACT(DAY FROM (CURRENT_DATE - "tgl spr"))
WHERE "tgl spr" IS NOT NULL;

-- Update progress berdasarkan status
UPDATE "data global master" 
SET "progres rumah" = CASE 
    WHEN "status unit" = 'SOLD' THEN '100%'
    WHEN "status unit" = 'AKAD_COMPLETED' THEN '95%'
    WHEN "status unit" = 'FUNDS_DISBURSED' THEN '90%'
    WHEN "status unit" = 'PROCESSING' THEN '50%'
    ELSE '0%'
END;

-- =====================================================
-- 5. UPDATE WITH JOIN (jika ada table lain)
-- =====================================================

-- Update berdasarkan user_profiles (contoh jika ada relasi)
UPDATE "data global master" dgm
SET "sales koordinator" = up.full_name
FROM user_profiles up
WHERE up.email = dgm."sales koordinator" 
  AND dgm."sales koordinator" LIKE '%@%';

-- =====================================================
-- 6. UPDATE TIMESTAMP FIELDS
-- =====================================================

-- Update timestamp saat ini
UPDATE "data global master" 
SET "updated_at" = NOW(),
    "timestamp" = NOW()
WHERE "id unit" = 'D28-07';

-- Update date fields
UPDATE "data global master" 
SET "tgl spr" = CURRENT_DATE,
    "rencana akad" = CURRENT_DATE + INTERVAL '30 days',
    "tgl akad" = CURRENT_DATE + INTERVAL '45 days'
WHERE "status unit" = 'RESERVED';

-- =====================================================
-- 7. UPDATE NULL FIELDS
-- =====================================================

-- Update fields yang kosong
UPDATE "data global master" 
SET "wa cust" = COALESCE("no telp ec", "wa cust", '+62800000000'),
    "email cust" = COALESCE("email cust", 'customer@example.com')
WHERE "wa cust" IS NULL OR "wa cust" = '';

-- Update default values
UPDATE "data global master" 
SET "status unit" = COALESCE("status unit", 'AVAILABLE'),
    "potensi app" = COALESCE("potensi app", 'MEDIUM')
WHERE "status unit" IS NULL;

-- =====================================================
-- 8. UPDATE WITH LOGIC
-- =====================================================

-- Update status berdasarkan progress
UPDATE "data global master" 
SET "status unit" = CASE 
    WHEN "progres rumah" = '100%' THEN 'SOLD'
    WHEN "progres rumah" >= '90%' THEN 'AKAD_COMPLETED'
    WHEN "progres rumah" >= '50%' THEN 'PROCESSING'
    WHEN "progres rumah" > '0%' THEN 'PEMBERKASAN'
    ELSE 'AVAILABLE'
END
WHERE "progres rumah" IS NOT NULL;

-- Update bank priority
UPDATE "data global master" 
SET "pic bank" = CASE 
    WHEN "plafon" > 500000000 THEN 'Senior Manager'
    WHEN "plafon" > 300000000 THEN 'Manager'
    ELSE 'Staff'
END
WHERE "pic bank" IS NULL OR "pic bank" = '';

-- =====================================================
-- 9. BULK UPDATE WITH SPECIFIC CONDITIONS
-- =====================================================

-- Update semua unit yang sudah lewat 30 hari
UPDATE "data global master" 
SET "aging fisik" = "aging hari" + 30,
    "isu kendala" = COALESCE("isu kendala", 'OVERDUE')
WHERE "aging hari" > 30;

-- Update units dengan specific sales
UPDATE "data global master" 
SET "sales koordinator" = 'Jane Smith',
    "keterangan" = 'Reassigned to Jane Smith'
WHERE "sales koordinator" = 'Old Staff Name';

-- =====================================================
-- 10. VERIFY UPDATE RESULTS
-- =====================================================

-- Cek hasil update
SELECT "id unit", "nama customer", "status unit", "bank final", "plafon"
FROM "data global master" 
WHERE "id unit" IN ('D28-07', 'D27-16', 'D28-02', 'E01-01', 'E01-02')
ORDER BY "id unit";

-- Cek count per status
SELECT "status unit", COUNT(*) as total
FROM "data global master" 
GROUP BY "status unit"
ORDER BY total DESC;

-- Cek VIP units
SELECT "id unit", "nama customer", "jenis produk", "status unit", "plafon"
FROM "data global master" 
WHERE "jenis produk" = 'semikomersil'
ORDER BY "plafon" DESC;

-- =====================================================
-- 11. ROLLBACK EXAMPLE (jika perlu)
-- =====================================================

-- Jika ada kesalahan, rollback dengan update ke nilai sebelumnya
-- (Simpan data sebelum update untuk backup)

-- Update ke nilai awal (contoh)
UPDATE "data global master" 
SET "status unit" = 'AVAILABLE',
    "bank final" = NULL,
    "plafon" = NULL,
    "cair" = NULL
WHERE "id unit" = 'D28-07'
  AND "status unit" = 'SOLD';
