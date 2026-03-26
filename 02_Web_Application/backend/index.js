const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware - CORS configuration
const corsOptions = {
  origin: [
    'https://devproflow.com',
    'https://www.devproflow.com', 
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevPro Flow Enterprise API Server',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      units: '/api/units',
      customers: '/api/customers',
      applications: '/api/applications',
      dashboard: '/api/dashboard/stats',
      whatsapp: '/api/whatsapp/send'
    },
    documentation: 'https://github.com/bramsray1/devpro-flow'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevPro Flow Enterprise API is running' });
});

// Units API
app.get('/api/units', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/units', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('units')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers API
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Applications API
app.get('/api/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        customers:customer_id(name, phone, email),
        units:unit_id(unit_type, price, status)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Statistics API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [unitsCount, applicationsCount, customersCount] = await Promise.all([
      supabase.from('units').select('count', { count: 'exact' }),
      supabase.from('applications').select('count', { count: 'exact' }),
      supabase.from('customers').select('count', { count: 'exact' })
    ]);

    const stats = {
      totalUnits: unitsCount.count || 0,
      totalApplications: applicationsCount.count || 0,
      totalCustomers: customersCount.count || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WhatsApp Integration API
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    // Generate WhatsApp link
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    res.json({ 
      success: true, 
      whatsappLink,
      message: 'WhatsApp link generated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only in non-serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 DevPro Flow Enterprise API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
