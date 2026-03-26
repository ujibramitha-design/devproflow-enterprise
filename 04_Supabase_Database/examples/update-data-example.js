// Update Data Example - KPRFlow Enterprise
// Cara mengubah data dari 04_Supabase_Database

import { supabase } from '../config/supabase.js';
import { updateUnitStatus, saveRowToSupabase } from '../helpers/bramsray1-helpers.js';

// 1. Update Status Unit
async function updateUnitStatusExample() {
    console.log('🔄 Update unit status example...');
    
    try {
        const result = await updateUnitStatus(
            'D28-07', // unit ID
            'SOLD',   // new status
            {
                'bank final': 'BJB',
                'plafon': 350000000,
                'cair': 350000000,
                'tgl akad': '2024-12-15'
            }
        );
        
        if (result.success) {
            console.log('✅ Unit status updated successfully!');
            console.log('📊 Updated data:', result.data[0]);
        } else {
            console.error('❌ Update failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 2. Update Multiple Fields
async function updateMultipleFields() {
    console.log('🔄 Update multiple fields example...');
    
    const updateData = {
        'nama customer': 'John Doe Updated',
        'sales koordinator': 'Jane Smith',
        'wa cust': '+628123456789',
        'email cust': 'john.doe@example.com',
        'progres rumah': '95%',
        'keterangan': 'Updated via API'
    };
    
    try {
        const { data, error } = await supabase
            .from('data global master')
            .update(updateData)
            .eq('id unit', 'D27-16')
            .select();
        
        if (error) {
            console.error('❌ Update failed:', error.message);
        } else {
            console.log('✅ Multiple fields updated successfully!');
            console.log('📊 Updated data:', data[0]);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 3. Update VIP Logic
async function updateVIPLogic() {
    console.log('🔄 Update VIP logic example...');
    
    const vipUnitData = {
        'id unit': 'E01-01',
        'nama customer': 'VIP Customer',
        'jenis produk': 'semikomersil', // Will be auto-set by VIP logic
        'status unit': 'RESERVED',
        'harga jual dpp': 850000000,
        'plafon': 680000000
    };
    
    try {
        const result = await saveRowToSupabase(vipUnitData);
        
        if (result.success) {
            console.log('✅ VIP unit updated successfully!');
            console.log('🏆 VIP logic applied automatically');
            console.log('📊 Updated data:', result.data[0]);
        } else {
            console.error('❌ VIP update failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 4. Batch Update Multiple Units
async function batchUpdateUnits() {
    console.log('🔄 Batch update example...');
    
    const updates = [
        { 'id unit': 'D28-07', 'status unit': 'SOLD', 'bank final': 'BJB' },
        { 'id unit': 'D27-16', 'status unit': 'AVAILABLE', 'harga jual dpp': 450000000 },
        { 'id unit': 'E01-02', 'status unit': 'RESERVED', 'nama customer': 'New Customer' }
    ];
    
    try {
        for (const update of updates) {
            const { data, error } = await supabase
                .from('data global master')
                .update(update)
                .eq('id unit', update['id unit'])
                .select();
            
            if (error) {
                console.error(`❌ Failed to update ${update['id unit']}:`, error.message);
            } else {
                console.log(`✅ Updated ${update['id unit']}:`, data[0]['status unit']);
            }
        }
        
        console.log('🎉 Batch update completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 5. Update with Conditions
async function conditionalUpdate() {
    console.log('🔄 Conditional update example...');
    
    try {
        // Update all units with status 'LEAD' to 'PROCESSING'
        const { data, error } = await supabase
            .from('data global master')
            .update({ 
                'status unit': 'PROCESSING',
                'proses pemberkasan': 'IN PROGRESS'
            })
            .eq('status unit', 'LEAD')
            .select();
        
        if (error) {
            console.error('❌ Conditional update failed:', error.message);
        } else {
            console.log(`✅ Updated ${data.length} units from LEAD to PROCESSING`);
            data.forEach(unit => {
                console.log(`   📝 ${unit['id unit']}: ${unit['nama customer']}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 6. Update Numeric Fields
async function updateNumericFields() {
    console.log('🔄 Update numeric fields example...');
    
    try {
        const { data, error } = await supabase
            .from('data global master')
            .update({
                'harga jual dpp': 550000000,
                'plafon': 440000000,
                'cair': 440000000,
                'pph': 4400000,
                'bphtb': 5500000
            })
            .eq('id unit', 'D28-02')
            .select();
        
        if (error) {
            console.error('❌ Numeric update failed:', error.message);
        } else {
            console.log('✅ Numeric fields updated successfully!');
            console.log('💰 Financial data:', {
                'harga jual dpp': data[0]['harga jual dpp'],
                'plafon': data[0]['plafon'],
                'cair': data[0]['cair']
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// 7. Update Date Fields
async function updateDateFields() {
    console.log('🔄 Update date fields example...');
    
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('data global master')
            .update({
                'tgl spr': today,
                'rencana akad': '2024-12-20',
                'tgl akad': '2024-12-25',
                'mbr date': '2024-12-15',
                'tgl ppjb': '2024-12-18'
            })
            .eq('id unit', 'E01-01')
            .select();
        
        if (error) {
            console.error('❌ Date update failed:', error.message);
        } else {
            console.log('✅ Date fields updated successfully!');
            console.log('📅 Date data:', {
                'tgl spr': data[0]['tgl spr'],
                'rencana akad': data[0]['rencana akad'],
                'tgl akad': data[0]['tgl akad']
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run all examples
async function runAllExamples() {
    console.log('🚀 Starting update examples...\n');
    
    await updateUnitStatusExample();
    console.log('\n' + '='.repeat(50));
    
    await updateMultipleFields();
    console.log('\n' + '='.repeat(50));
    
    await updateVIPLogic();
    console.log('\n' + '='.repeat(50));
    
    await batchUpdateUnits();
    console.log('\n' + '='.repeat(50));
    
    await conditionalUpdate();
    console.log('\n' + '='.repeat(50));
    
    await updateNumericFields();
    console.log('\n' + '='.repeat(50));
    
    await updateDateFields();
    console.log('\n🎉 All update examples completed!');
}

// Export functions
export {
    updateUnitStatusExample,
    updateMultipleFields,
    updateVIPLogic,
    batchUpdateUnits,
    conditionalUpdate,
    updateNumericFields,
    updateDateFields,
    runAllExamples
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples();
}
