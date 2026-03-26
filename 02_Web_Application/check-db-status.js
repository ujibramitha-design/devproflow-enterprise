const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY not found in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log(`Checking database: ${supabaseUrl}`);
  
  try {
    const [units, customers, applications] = await Promise.all([
      supabase.from('units').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true })
    ]);

    console.log('--- Database Stats ---');
    console.log(`Units: ${units.count || 0}`);
    console.log(`Customers: ${customers.count || 0}`);
    console.log(`Applications: ${applications.count || 0}`);
    
    if (units.error) console.error('Units Error:', units.error.message);
    if (customers.error) console.error('Customers Error:', customers.error.message);
    if (applications.error) console.error('Applications Error:', applications.error.message);

    // Get sample of units to see if they are real
    if (units.count > 0) {
        const { data: sampleUnits } = await supabase.from('units').select('unit_type, status').limit(3);
        console.log('Sample Units:', sampleUnits);
    }

  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

checkData();
