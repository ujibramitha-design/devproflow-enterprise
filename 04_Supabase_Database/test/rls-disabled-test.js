// RLS Disabled Test - KPRFlow Enterprise
// Test update operations without RLS restrictions

import { testConnection, db } from '../config/supabase-no-rls.js';

// Test update without RLS
async function testUpdateWithoutRLS() {
    console.log('🔄 Testing update without RLS restrictions...');
    
    try {
        // Test update unit D28-07
        const result = await db.update('D28-07', {
            'status unit': 'SOLD',
            'bank final': 'BJB',
            'plafon': 350000000,
            'cair': 350000000,
            'tgl akad': '2024-12-15'
        });
        
        if (result) {
            console.log('✅ Update successful (No RLS):');
            console.log('📊 Updated data:', result[0]);
            return true;
        } else {
            console.log('❌ Update failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Update error:', error.message);
        return false;
    }
}

// Test insert without RLS
async function testInsertWithoutRLS() {
    console.log('🔄 Testing insert without RLS restrictions...');
    
    try {
        // Test insert new unit
        const result = await db.insert({
            'no': 999,
            'id unit': 'TEST-001',
            'nama customer': 'Test Customer',
            'status unit': 'AVAILABLE',
            'harga jual dpp': 450000000,
            'plafon': 360000000,
            'keterangan': 'Test insert without RLS'
        });
        
        if (result) {
            console.log('✅ Insert successful (No RLS):');
            console.log('📊 Inserted data:', result[0]);
            return true;
        } else {
            console.log('❌ Insert failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Insert error:', error.message);
        return false;
    }
}

// Test delete without RLS
async function testDeleteWithoutRLS() {
    console.log('🔄 Testing delete without RLS restrictions...');
    
    try {
        // Test delete test unit
        const result = await db.delete('TEST-001');
        
        if (result) {
            console.log('✅ Delete successful (No RLS):');
            console.log('📊 Deleted data:', result[0]);
            return true;
        } else {
            console.log('❌ Delete failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Delete error:', error.message);
        return false;
    }
}

// Test VIP logic without RLS
async function testVIPLogicWithoutRLS() {
    console.log('🔄 Testing VIP logic without RLS restrictions...');
    
    try {
        // Test VIP unit update
        const result = await db.update('D28-07', {
            'status unit': 'SOLD',
            'keterangan': 'VIP unit update test'
        });
        
        if (result) {
            console.log('✅ VIP update successful (No RLS):');
            console.log('📊 Updated data:', result[0]);
            console.log('🏆 VIP Logic Applied:', result[0]['jenis produk']);
            return true;
        } else {
            console.log('❌ VIP update failed');
            return false;
        }
    } catch (error) {
        console.error('❌ VIP logic error:', error.message);
        return false;
    }
}

// Test search without RLS
async function testSearchWithoutRLS() {
    console.log('🔄 Testing search without RLS restrictions...');
    
    try {
        // Test search by customer name
        const result = await db.search({
            'nama customer': 'Test'
        });
        
        if (result) {
            console.log('✅ Search successful (No RLS):');
            console.log(`📊 Found ${result.length} records`);
            return true;
        } else {
            console.log('❌ Search failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Search error:', error.message);
        return false;
    }
}

// Test statistics without RLS
async function testStatisticsWithoutRLS() {
    console.log('🔄 Testing statistics without RLS restrictions...');
    
    try {
        const stats = await db.getStatistics();
        
        if (stats) {
            console.log('✅ Statistics successful (No RLS):');
            console.log('📊 Statistics:', stats);
            return true;
        } else {
            console.log('❌ Statistics failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Statistics error:', error.message);
        return false;
    }
}

// Main test function
async function testRLSDisabled() {
    console.log('🚀 Testing RLS Disabled Configuration...');
    console.log('=' .repeat(50));
    
    // Test connection
    console.log('\n--- Step 1: Connection Test ---');
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
        console.error('❌ Connection test failed. RLS disabled test aborted.');
        return false;
    }
    
    // Test update
    console.log('\n--- Step 2: Update Test ---');
    const updateTest = await testUpdateWithoutRLS();
    
    // Test insert
    console.log('\n--- Step 3: Insert Test ---');
    const insertTest = await testInsertWithoutRLS();
    
    // Test delete
    console.log('\n--- Step 4: Delete Test ---');
    const deleteTest = await testDeleteWithoutRLS();
    
    // Test VIP logic
    console.log('\n--- Step 5: VIP Logic Test ---');
    const vipTest = await testVIPLogicWithoutRLS();
    
    // Test search
    console.log('\n--- Step 6: Search Test ---');
    const searchTest = await testSearchWithoutRLS();
    
    // Test statistics
    console.log('\n--- Step 7: Statistics Test ---');
    const statsTest = await testStatisticsWithoutRLS();
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 RLS Disabled Tests Completed!');
    console.log('📊 Summary:');
    console.log(`   Connection: ${connectionTest ? '✅' : '❌'}`);
    console.log(`   Update: ${updateTest ? '✅' : '❌'}`);
    console.log(`   Insert: ${insertTest ? '✅' : '❌'}`);
    console.log(`   Delete: ${deleteTest ? '✅' : '❌'}`);
    console.log(`   VIP Logic: ${vipTest ? '✅' : '❌'}`);
    console.log(`   Search: ${searchTest ? '✅' : '❌'}`);
    console.log(`   Statistics: ${statsTest ? '✅' : '❌'}`);
    
    console.log('\n📋 RLS Status: DISABLED');
    console.log('🔓 Access Mode: ANONYMOUS ONLY');
    console.log('🔓 Restrictions: NONE');
    console.log('🔓 VIP Logic: AUTO-APPLIED');
    console.log('🔓 Authentication: NOT REQUIRED');
    console.log('🔓 Confirmation: NOT REQUIRED');
    
    return {
        connection: connectionTest,
        update: updateTest,
        insert: insertTest,
        delete: deleteTest,
        vipLogic: vipTest,
        search: searchTest,
        statistics: statsTest
    };
}

// Export functions
export {
    testRLSDisabled,
    testUpdateWithoutRLS,
    testInsertWithoutRLS,
    testDeleteWithoutRLS,
    testVIPLogicWithoutRLS,
    testSearchWithoutRLS,
    testStatisticsWithoutRLS
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testRLSDisabled();
}
