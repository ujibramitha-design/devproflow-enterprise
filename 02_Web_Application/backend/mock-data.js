// Mock Data Generator untuk KPRFlow Enterprise
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Data Storage
let mockData = {
  units: [
    {
      id: 1,
      unit_id: 'LF-001-01',
      unit_type: 'Type 36/72',
      block: 'A',
      number: '001',
      price: 450000000,
      status: 'AVAILABLE',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      unit_id: 'LF-001-02',
      unit_type: 'Type 45/90',
      block: 'A',
      number: '002',
      price: 550000000,
      status: 'SOLD',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      unit_id: 'LF-001-03',
      unit_type: 'Type 54/108',
      block: 'B',
      number: '001',
      price: 650000000,
      status: 'AKAD',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      unit_id: 'LF-001-04',
      unit_type: 'Type 70/140',
      block: 'B',
      number: '002',
      price: 750000000,
      status: 'CAIR',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      unit_id: 'LF-001-05',
      unit_type: 'Type 36/72',
      block: 'C',
      number: '001',
      price: 480000000,
      status: 'AVAILABLE',
      created_at: new Date().toISOString()
    }
  ],
  customers: [
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '08123456789',
      address: 'Jakarta Selatan',
      income: 15000000,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      phone: '08234567890',
      address: 'Jakarta Timur',
      income: 12000000,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@email.com',
      phone: '08345678901',
      address: 'Jakarta Barat',
      income: 18000000,
      created_at: new Date().toISOString()
    }
  ],
  applications: [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
  ]
};

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'KPRFlow Enterprise Mock API Server',
    version: '1.0.0',
    status: 'Running with Mock Data',
    endpoints: {
      health: '/api/health',
      units: '/api/units',
      customers: '/api/customers',
      applications: '/api/applications',
      dashboard: '/api/dashboard/stats',
      whatsapp: '/api/whatsapp/send'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KPRFlow Enterprise Mock API is running' });
});

// Units API
app.get('/api/units', (req, res) => {
  res.json(mockData.units);
});

app.post('/api/units', (req, res) => {
  const newUnit = {
    id: mockData.units.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  mockData.units.push(newUnit);
  res.json(newUnit);
});

// Customers API
app.get('/api/customers', (req, res) => {
  res.json(mockData.customers);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: mockData.customers.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  mockData.customers.push(newCustomer);
  res.json(newCustomer);
});

// Applications API
app.get('/api/applications', (req, res) => {
  // Join dengan customer dan unit data
  const applicationsWithDetails = mockData.applications.map(app => ({
    ...app,
    customer: mockData.customers.find(c => c.id === app.customer_id),
    unit: mockData.units.find(u => u.unit_id === app.unit_id)
  }));
  res.json(applicationsWithDetails);
});

app.post('/api/applications', (req, res) => {
  const newApplication = {
    id: mockData.applications.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockData.applications.push(newApplication);
  res.json(newApplication);
});

// Dashboard Statistics API
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalUnits: mockData.units.length,
    totalApplications: mockData.applications.length,
    totalCustomers: mockData.customers.length,
    unitsByStatus: {
      available: mockData.units.filter(u => u.status === 'AVAILABLE').length,
      sold: mockData.units.filter(u => u.status === 'SOLD').length,
      akad: mockData.units.filter(u => u.status === 'AKAD').length,
      cair: mockData.units.filter(u => u.status === 'CAIR').length
    },
    applicationsByStatus: {
      pending: mockData.applications.filter(a => a.status === 'PENDING').length,
      process: mockData.applications.filter(a => a.status === 'PROCESS').length,
      approved: mockData.applications.filter(a => a.status === 'APPROVED').length,
      completed: mockData.applications.filter(a => a.status === 'COMPLETED').length
    },
    totalRevenue: mockData.units
      .filter(u => u.status === 'CAIR')
      .reduce((sum, u) => sum + u.price, 0)
  };
  res.json(stats);
});

// WhatsApp Integration API
app.post('/api/whatsapp/send', (req, res) => {
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
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 KPRFlow Enterprise Mock API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Mock Data Loaded:`);
  console.log(`   - Units: ${mockData.units.length}`);
  console.log(`   - Customers: ${mockData.customers.length}`);
  console.log(`   - Applications: ${mockData.applications.length}`);
});

module.exports = app;
