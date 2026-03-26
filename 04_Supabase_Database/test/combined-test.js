// Combined Database Test - bramsray1 + bramsray2
// Test both databases and combined functionality

import { databaseManager } from '../config/supabase-combined.js';

// Test both connections
async function testBothConnections() {
    console.log('🔍 Testing both database connections...');
    
    try {
        const results = await databaseManager.testBothConnections();
        
        console.log('\n📊 Connection Results:');
        console.log(`   bramsray1: ${results.bramray1.success ? '✅' : '❌'} (${results.bramray1.records} records)`);
        console.log(`   bramsray2: ${results.bramray2.success ? '✅' : '❌'} (${results.bramray2.records} records)`);
        
        return results;
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        return null;
    }
}

// Test bramsray1 functionality
async function testBramray1Functionality() {
    console.log('🔍 Testing bramsray1 functionality...');
    
    try {
        // Test data retrieval
        const data = await databaseManager.getBramray1Data();
        console.log(`✅ Retrieved ${data.length} records from bramsray1`);
        
        // Test VIP units
        const vipUnits = await databaseManager.getVIPUnits();
        console.log(`✅ Found ${vipUnits.length} VIP units`);
        
        // Test statistics
        const stats = await databaseManager.getBramray1Statistics();
        console.log('✅ Statistics:', stats);
        
        return { success: true, data, vipUnits, stats };
    } catch (error) {
        console.error('❌ bramsray1 functionality test failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Test bramsray2 functionality
async function testBramray2Functionality() {
    console.log('🔍 Testing bramsray2 functionality...');
    
    try {
        // Test table access
        const tables = ['user_profiles', 'kpr_dossiers', 'unit_properties'];
        const results = {};
        
        for (const table of tables) {
            try {
                const { data, error } = await databaseManager.getBramray2Client()
                    .from(table)
                    .select('count')
                    .limit(1);
                
                results[table] = {
                    success: !error,
                    count: data?.[0]?.count || 0,
                    error: error?.message
                };
                
                console.log(`${results[table].success ? '✅' : '❌'} ${table}: ${results[table].count} records`);
            } catch (err) {
                results[table] = { success: false, error: err.message };
                console.log(`❌ ${table}: ${err.message}`);
            }
        }
        
        return results;
    } catch (error) {
        console.error('❌ bramsray2 functionality test failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Test database switching
async function testDatabaseSwitching() {
    console.log('🔍 Testing database switching...');
    
    try {
        // Switch to bramsray1
        const client1 = databaseManager.switchTo('bramsray1');
        console.log('✅ Switched to bramsray1');
        
        // Test bramsray1 query
        const { data: data1, error: error1 } = await client1
            .from('data global master')
            .select('count')
            .limit(1);
        
        if (error1) throw error1;
        console.log(`✅ bramsray1 query: ${data1[0].count} records`);
        
        // Switch to bramsray2
        const client2 = databaseManager.switchTo('bramsray2');
        console.log('✅ Switched to bramsray2');
        
        // Test bramsray2 query
        const { data: data2, error: error2 } = await client2
            .from('user_profiles')
            .select('count')
            .limit(1);
        
        if (error2) throw error2;
        console.log(`✅ bramsray2 query: ${data2[0].count} records`);
        
        // Switch back to bramsray1
        databaseManager.switchTo('bramsray1');
        
        return { success: true };
    } catch (error) {
        console.error('❌ Database switching test failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Test real-time subscription
async function testRealtimeSubscription() {
    console.log('🔍 Testing real-time subscription...');
    
    try {
        // Subscribe to bramsray2 changes
        const subscription = databaseManager.subscribeToRealtime(
            'user_profiles',
            (payload) => {
                console.log('📡 Real-time event received:', payload);
            },
            'bramsray2'
        );
        
        console.log('✅ Real-time subscription created');
        
        // Keep subscription alive for 5 seconds
        setTimeout(() => {
            subscription.unsubscribe();
            console.log('📡 Real-time subscription unsubscribed');
        }, 5000);
        
        return { success: true };
    } catch (error) {
        console.error('❌ Real-time subscription test failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Test combined status
async function testCombinedStatus() {
    console.log('🔍 Testing combined status...');
    
    try {
        const status = databaseManager.getStatus();
        
        console.log('📊 Combined Status:');
        console.log(`   Active Database: ${status.activeDatabase}`);
        console.log(`   bramsray1 URL: ${status.bramray1Config.url}`);
        console.log(`   bramsray1 VIP Units: ${status.bramray1Config.vipUnits}`);
        console.log(`   bramsray2 URL: ${status.bramray2Config.url}`);
        console.log(`   bramsray2 Tables: ${status.bramray2Config.tables}`);
        console.log(`   bramsray2 Configured: ${status.bramray2Config.configured}`);
        
        return status;
    } catch (error) {
        console.error('❌ Combined status test failed:', error.message);
        return null;
    }
}

// Main test function
async function runCombinedTests() {
    console.log('🚀 Starting Combined Database Tests...');
    console.log('=' .repeat(50));
    
    const results = {};
    
    // Test 1: Both connections
    console.log('\n--- Test 1: Both Connections ---');
    results.connections = await testBothConnections();
    
    // Test 2: bramsray1 functionality
    console.log('\n--- Test 2: bramsray1 Functionality ---');
    results.bramray1 = await testBramray1Functionality();
    
    // Test 3: bramsray2 functionality
    console.log('\n--- Test 3: bramsray2 Functionality ---');
    results.bramray2 = await testBramray2Functionality();
    
    // Test 4: Database switching
    console.log('\n--- Test 4: Database Switching ---');
    results.switching = await testDatabaseSwitching();
    
    // Test 5: Real-time subscription
    console.log('\n--- Test 5: Real-time Subscription ---');
    results.realtime = await testRealtimeSubscription();
    
    // Test 6: Combined status
    console.log('\n--- Test 6: Combined Status ---');
    results.status = await testCombinedStatus();
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 Combined Tests Completed!');
    console.log('📊 Summary:');
    console.log(`   Connections: ${results.connections ? '✅' : '❌'}`);
    console.log(`   bramsray1: ${results.bramray1?.success ? '✅' : '❌'}`);
    console.log(`   bramsray2: ${results.bramray2?.success ? '✅' : '❌'}`);
    console.log(`   Switching: ${results.switching?.success ? '✅' : '❌'}`);
    console.log(`   Real-time: ${results.realtime?.success ? '✅' : '❌'}`);
    console.log(`   Status: ${results.status ? '✅' : '❌'}`);
    
    return results;
}

// Export functions
export {
    testBothConnections,
    testBramray1Functionality,
    testBramray2Functionality,
    testDatabaseSwitching,
    testRealtimeSubscription,
    testCombinedStatus,
    runCombinedTests
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runCombinedTests();
}
