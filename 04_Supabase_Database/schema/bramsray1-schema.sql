-- =====================================================
-- KPRFlow Enterprise - bramsray1 Table Schema
-- Table: data global master
-- =====================================================

-- Create main table (data global master)
CREATE TABLE IF NOT EXISTS "data global master" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no INTEGER,
    "tgl spr" DATE,
    "id unit" VARCHAR(50),
    "aging hari" INTEGER,
    "nama customer" VARCHAR(255),
    "sales koordinator" VARCHAR(255),
    "harga jual dpp" DECIMAL(15,2),
    "progres rumah" VARCHAR(100),
    "keterangan" TEXT,
    "isu kendala" TEXT,
    "proses pemberkasan" VARCHAR(100),
    "solusi masalah" TEXT,
    "aging fisik" INTEGER,
    "pic bank" VARCHAR(255),
    "bjb" VARCHAR(20),
    "mandiri" VARCHAR(20),
    "bni" VARCHAR(20),
    "bri" VARCHAR(20),
    "btn" VARCHAR(20),
    "bsi" VARCHAR(20),
    "status unit" VARCHAR(50),
    "potensi app" VARCHAR(20),
    "rencana akad" DATE,
    "potensi batal" VARCHAR(20),
    "tgl akad" DATE,
    "bank final" VARCHAR(50),
    "plafon" DECIMAL(15,2),
    "cair" DECIMAL(15,2),
    "ajb ppjb" VARCHAR(20),
    "pph" DECIMAL(15,2),
    "bphtb" DECIMAL(15,2),
    "wa cust" VARCHAR(20),
    "email cust" VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "sumber" VARCHAR(100),
    "koordinat" VARCHAR(100),
    "no spr" VARCHAR(50),
    "ttl cust" DATE,
    "nik cust" VARCHAR(20),
    "npwp cust" VARCHAR(25),
    "alamat ktp cust" TEXT,
    "alamat dom cust" TEXT,
    "nama pasangan" VARCHAR(255),
    "ttl pasangan" DATE,
    "nik pasangan" VARCHAR(20),
    "npwp pasangan" VARCHAR(25),
    "alamat ktp pasangan" TEXT,
    "alamat dom pasangan" TEXT,
    "no telp ec" VARCHAR(20),
    "nama ec" VARCHAR(255),
    "alamat ec" TEXT,
    "hubungan ec" VARCHAR(50),
    "siteplan" VARCHAR(100),
    "no id rumah" VARCHAR(50),
    
    -- Additional columns from bramsray1
    "siteplan index" INTEGER,
    "cluster" VARCHAR(50),
    "blok" VARCHAR(10),
    "nomor" VARCHAR(10),
    "jenis produk" VARCHAR(50),
    "tipe unit" VARCHAR(50),
    "payment method" VARCHAR(50),
    "vat incentive" VARCHAR(20),
    "mbr status" VARCHAR(20),
    "mbr date" DATE,
    "ssp" VARCHAR(50),
    "validasi ssp" VARCHAR(20),
    "validasi bphtb" VARCHAR(20),
    "bphtb subsidy" DECIMAL(15,2),
    "notaris" VARCHAR(255),
    "balik nama" VARCHAR(20),
    "tgl ppjb" DATE,
    "no ppjb notaril" VARCHAR(50),
    "salinan ajb notaril" VARCHAR(50),
    "no akta buyback" VARCHAR(50),
    "bast bank" VARCHAR(20),
    "bast developer" VARCHAR(20),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_data_global_master_id_unit ON "data global master"("id unit");
CREATE INDEX IF NOT EXISTS idx_data_global_master_no_spr ON "data global master"("no spr");
CREATE INDEX IF NOT EXISTS idx_data_global_master_nama_customer ON "data global master"("nama customer");
CREATE INDEX IF NOT EXISTS idx_data_global_master_status_unit ON "data global master"("status unit");
CREATE INDEX IF NOT EXISTS idx_data_global_master_tgl_spr ON "data global master"("tgl spr");
CREATE INDEX IF NOT EXISTS idx_data_global_master_bank_final ON "data global master"("bank final");

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_data_global_master_updated_at 
    BEFORE UPDATE ON "data global master" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE "data global master" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anonymous users to read data (for public access)
CREATE POLICY "Allow anonymous read access" ON "data global master"
    FOR SELECT USING (true);

-- Allow authenticated users to insert data
CREATE POLICY "Allow authenticated insert" ON "data global master"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own data
CREATE POLICY "Allow authenticated update own" ON "data global master"
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own data
CREATE POLICY "Allow authenticated delete own" ON "data global master"
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create view for easy access
CREATE OR REPLACE VIEW data_global_master_view AS
SELECT 
    id,
    no,
    "tgl spr",
    "id unit",
    "aging hari",
    "nama customer",
    "sales koordinator",
    "harga jual dpp",
    "progres rumah",
    "status unit",
    "bank final",
    "plafon",
    "cair",
    "potensi app",
    "rencana akad",
    "tgl akad",
    "wa cust",
    "email cust",
    "siteplan",
    "cluster",
    "blok",
    "nomor",
    "jenis produk",
    "tipe unit",
    timestamp,
    created_at,
    updated_at
FROM "data global master"
ORDER BY no ASC;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON "data global master" TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON "data global master" TO authenticated;
GRANT SELECT ON data_global_master_view TO anon, authenticated;
