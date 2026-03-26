// KPRFlow Enterprise - bramsray1 Connection Test
// Test Supabase connection and basic operations

import { supabase } from '../config/supabase.js';
import { 
    pullDataFromSupabase, 
    getVIPUnitsData, 
    getStatistics,
    TABLE_NAME 
} from '../helpers/bramsray1-helpers.js';

/**
 * Test basic Supabase connection
 */
async function testConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
        // Test basic connection
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Connection test failed:', error.message);
            return false;
        }

        console.log('✅ Supabase connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Connection test error:', error.message);
        return false;
    }
}

/**
 * Test data retrieval
 */
async function testDataRetrieval() {
    console.log('🔍 Testing data retrieval...');
    
    try {
        const result = await pullDataFromSupabase();
        
        if (result.success) {
            console.log(`✅ Retrieved ${result.data.length} records`);
            
            // Show first record sample
            if (result.data.length > 0) {
                console.log('📋 Sample record:', {
                    no: result.data[0].no,
                    'id unit': result.data[0]['id unit'],
                    'nama customer': result.data[0]['nama customer'],
                    'status unit': result.data[0]['status unit']
                });
            }
            
            return true;
        } else {
            console.error('❌ Data retrieval failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Data retrieval error:', error.message);
        return false;
    }
}

/**
 * Test VIP units retrieval
 */
async function testVIPUnits() {
    console.log('🔍 Testing VIP units retrieval...');
    
    try {
        const result = await getVIPUnitsData();
        
        if (result.success) {
            console.log(`✅ Found ${result.data.length} VIP units`);
            
            result.data.forEach(unit => {
                console.log(`🏆 VIP Unit: ${unit['id unit']} - ${unit['nama customer']} (${unit['jenis produk']})`);
            });
            
            return true;
        } else {
            console.error('❌ VIP units retrieval failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ VIP units retrieval error:', error.message);
        return false;
    }
}

/**
 * Test statistics
 */
async function testStatistics() {
    console.log('🔍 Testing statistics...');
    
    try {
        const result = await getStatistics();
        
        if (result.success) {
            console.log('✅ Statistics retrieved:');
            console.log('📊 Status breakdown:');
            
            Object.entries(result.stats).forEach(([status, count]) => {
                console.log(`   ${status}: ${count} units`);
            });
            
            return true;
        } else {
            console.error('❌ Statistics retrieval failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Statistics retrieval error:', error.message);
        return false;
    }
}

/**
 * Test table structure
 */
async function testTableStructure() {
    console.log('🔍 Testing table structure...');
    
    try {
        // Get table info
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Table structure test failed:', error.message);
            return false;
        }

        if (data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log(`✅ Table has ${columns.length} columns`);
            console.log('📋 Column list:');
            columns.forEach((col, index) => {
                console.log(`   ${index + 1}. ${col}`);
            });
        } else {
            console.log('ℹ️ Table is empty, but structure is accessible');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Table structure test error:', error.message);
        return false;
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Starting KPRFlow bramsray1 Supabase Tests');
    console.log('=' .repeat(50));
    
    const tests = [
        { name: 'Connection Test', func: testConnection },
        { name: 'Table Structure Test', func: testTableStructure },
        { name: 'Data Retrieval Test', func: testDataRetrieval },
        { name: 'VIP Units Test', func: testVIPUnits },
        { name: 'Statistics Test', func: testStatistics }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        console.log(`\n--- ${test.name} ---`);
        const result = await test.func();
        if (result) {
            passedTests++;
            console.log(`✅ ${test.name} PASSED`);
        } else {
            console.log(`❌ ${test.name} FAILED`);
        }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! bramsray1 Supabase is ready to use.');
    } else {
        console.log('⚠️ Some tests failed. Please check the configuration.');
    }
    
    return passedTests === totalTests;
}

// Export functions
export {
    testConnection,
    testDataRetrieval,
    testVIPUnits,
    testStatistics,
    testTableStructure,
    runAllTests
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test execution failed:', error);
            process.exit(1);
        });
}
