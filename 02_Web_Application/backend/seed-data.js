// Sample Data Seeder for KPRFlow Enterprise
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample Units Data
const sampleUnits = [
  {
    unit_id: 'LF-001-01',
    unit_type: 'Type 36/72',
    block: 'A',
    number: '001',
    price: 450000000,
    status: 'AVAILABLE',
    created_at: new Date().toISOString()
  },
  {
    unit_id: 'LF-001-02',
    unit_type: 'Type 45/90',
    block: 'A',
    number: '002',
    price: 550000000,
    status: 'SOLD',
    created_at: new Date().toISOString()
  },
  {
    unit_id: 'LF-001-03',
    unit_type: 'Type 54/108',
    block: 'B',
    number: '001',
    price: 650000000,
    status: 'AKAD',
    created_at: new Date().toISOString()
  },
  {
    unit_id: 'LF-001-04',
    unit_type: 'Type 70/140',
    block: 'B',
    number: '002',
    price: 750000000,
    status: 'CAIR',
    created_at: new Date().toISOString()
  },
  {
    unit_id: 'LF-001-05',
    unit_type: 'Type 36/72',
    block: 'C',
    number: '001',
    price: 480000000,
    status: 'AVAILABLE',
    created_at: new Date().toISOString()
  }
];

// Sample Customers Data
const sampleCustomers = [
  {
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '08123456789',
    address: 'Jakarta Selatan',
    income: 15000000,
    created_at: new Date().toISOString()
  },
  {
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    phone: '08234567890',
    address: 'Jakarta Timur',
    income: 12000000,
    created_at: new Date().toISOString()
  },
  {
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    phone: '08345678901',
    address: 'Jakarta Barat',
    income: 18000000,
    created_at: new Date().toISOString()
  }
];

// Sample Applications Data
const sampleApplications = [
  {
    customer_id: 1,
    unit_id: 'LF-001-02',
    bank_id: 'BCA',
    status: 'APPROVED',
    down_payment: 110000000,
    loan_amount: 440000000,
    notes: 'KPR BCA 15 tahun',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    customer_id: 2,
    unit_id: 'LF-001-03',
    bank_id: 'BNI',
    status: 'PROCESS',
    down_payment: 130000000,
    loan_amount: 520000000,
    notes: 'KPR BNI 20 tahun',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    customer_id: 3,
    unit_id: 'LF-001-04',
    bank_id: 'MANDIRI',
    status: 'COMPLETED',
    down_payment: 150000000,
    loan_amount: 600000000,
    notes: 'KPR Mandiri 10 tahun - CAIR',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await supabase.from('applications').delete().neq('id', 0);
    await supabase.from('customers').delete().neq('id', 0);
    await supabase.from('units').delete().neq('id', 0);

    // Insert Units
    console.log('📦 Inserting units...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .insert(sampleUnits)
      .select();

    if (unitsError) throw unitsError;
    console.log(`✅ Inserted ${units.length} units`);

    // Insert Customers
    console.log('👥 Inserting customers...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .insert(sampleCustomers)
      .select();

    if (customersError) throw customersError;
    console.log(`✅ Inserted ${customers.length} customers`);

    // Insert Applications
    console.log('📋 Inserting applications...');
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .insert(sampleApplications)
      .select();

    if (applicationsError) throw applicationsError;
    console.log(`✅ Inserted ${applications.length} applications`);

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Units: ${units.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Applications: ${applications.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeder
seedData();
