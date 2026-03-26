// Siteplan Integration - KPRFlow Enterprise
// House ID Generation System with Prefix Legal

// Siteplan data structure
const SITEPLAN_DATA = {
    1: {
        name: "Ciruas land",
        prefix_legal: "SRG0310122020T002",
        year: "2020",
        image_path: "/07_Raw_Materials_Data/master siteplan.jpg",
        status: "active"
    },
    2: {
        name: "Ciruasland tahap 3",
        prefix_legal: "SRG0310122024T001", 
        year: "2024",
        image_path: "/07_Raw_Materials_Data/master siteplan.jpg",
        status: "active"
    }
};

// Unit categories
const UNIT_CATEGORIES = {
    'PLATINUM': 'Premium',
    'SKANDIUM': 'High-End',
    'PALADIO': 'Luxury',
    'TITANIUM': 'Ultra-Premium',
    'GOLD': 'Standard Premium',
    'CROWN': 'Luxury Elite'
};

// House ID generation function
function generateHouseId(siteplanIndex, block, number, category = 'PLATINUM') {
    const siteplan = SITEPLAN_DATA[siteplanIndex];
    if (!siteplan) {
        console.error(`Invalid siteplan index: ${siteplanIndex}`);
        return null;
    }
    
    // Validate category
    const validCategories = Object.keys(UNIT_CATEGORIES);
    if (!validCategories.includes(category.toUpperCase())) {
        console.warn(`Invalid category: ${category}. Using PLATINUM as default.`);
        category = 'PLATINUM';
    }
    
    // Format block (pad with zeros)
    const blockFormatted = block.toString().padStart(2, '0').toUpperCase();
    
    // Format number (pad with zeros)
    const numberFormatted = number.toString().padStart(2, '0');
    
    // Format category
    const categoryFormatted = category.toUpperCase();
    
    return `${siteplan.prefix_legal}${categoryFormatted}${blockFormatted}${numberFormatted}`;
}

// Parse house ID function
function parseHouseId(houseId) {
    // Pattern: SRG031012YYYYTXXX[KATEGORI][BLOK][NOMOR]
    const pattern = /^SRG031012(\d{4})T(\d{3})(PLATINUM|SKANDIUM|PALADIO|TITANIUM|GOLD|CROWN)(\d{2})(\d{2})$/;
    const match = houseId.match(pattern);
    
    if (!match) return null;
    
    const siteplanCode = match[2];
    const siteplanIndex = siteplanCode === '002' ? 1 : 2;
    
    return {
        prefix: `SRG031012${match[1]}T${match[2]}`,
        year: match[1],
        siteplanCode: match[2],
        siteplanIndex: siteplanIndex,
        siteplanName: SITEPLAN_DATA[siteplanIndex].name,
        category: match[3],
        categoryDescription: UNIT_CATEGORIES[match[3]],
        block: match[4],
        number: match[5],
        blockNumber: `${match[4]}-${match[5]}`
    };
}

// Validate house ID
function validateHouseId(houseId) {
    if (!houseId) return false;
    const pattern = /^SRG031012\d{4}T\d{3}(PLATINUM|SKANDIUM|PALADIO|TITANIUM|GOLD|CROWN)\d{2}\d{2}$/;
    return pattern.test(houseId);
}

// Get siteplan by index
function getSiteplanByIndex(index) {
    return SITEPLAN_DATA[index] || null;
}

// Get siteplan by prefix legal
function getSiteplanByPrefix(prefix) {
    for (const [index, siteplan] of Object.entries(SITEPLAN_DATA)) {
        if (siteplan.prefix_legal === prefix) {
            return { ...siteplan, index: parseInt(index) };
        }
    }
    return null;
}

// Get dropdown options for siteplan
function getSiteplanDropdownOptions() {
    return Object.entries(SITEPLAN_DATA).map(([index, siteplan]) => ({
        value: index,
        label: `${siteplan.name} (${siteplan.prefix_legal})`,
        prefix: siteplan.prefix_legal,
        year: siteplan.year
    }));
}

// Get dropdown options for categories
function getUnitCategoryDropdownOptions() {
    return Object.entries(UNIT_CATEGORIES).map(([category, description]) => ({
        value: category,
        label: `${category} - ${description}`
    }));
}

// Transform functions for Google Apps Script
function transformSiteplanIndex(value) {
    if (!value) return null;
    const num = parseInt(value);
    return (num >= 1 && num <= 10) ? num : null;
}

function transformHouseId(houseId) {
    if (!houseId) return null;
    
    if (!validateHouseId(houseId)) {
        console.warn(`Invalid house ID format: ${houseId}`);
        return null;
    }
    
    return houseId.toString().trim();
}

function transformUnitCategory(category) {
    if (!category) return null;
    
    const validCategories = Object.keys(UNIT_CATEGORIES);
    const upperCategory = category.toString().trim().toUpperCase();
    
    if (!validCategories.includes(upperCategory)) {
        console.warn(`Invalid category: ${category}`);
        return null;
    }
    
    return upperCategory;
}

function transformPrefixLegal(prefix) {
    if (!prefix) return null;
    
    // Validate prefix format
    const pattern = /^SRG031012\d{4}T\d{3}$/;
    if (!pattern.test(prefix)) {
        console.warn(`Invalid prefix format: ${prefix}`);
        return null;
    }
    
    return prefix.toString().trim();
}

// Auto-generate house ID from components
function autoGenerateHouseId(siteplanIndex, block, number, category) {
    if (!siteplanIndex || !block || !number) {
        console.error('Missing required components for house ID generation');
        return null;
    }
    
    return generateHouseId(siteplanIndex, block, number, category || 'PLATINUM');
}

// Column mapping functions
function getHouseIdColumnMapping() {
    return {
        "house_id": {
            "target_field": "house_id",
            "data_type": "string",
            "description": "House ID with prefix legal and category",
            "validation": {
                "required": false,
                "max_length": 50,
                "pattern": "^SRG031012\\d{4}T\\d{3}(PLATINUM|SKANDIUM|PALADIO|TITANIUM|GOLD|CROWN)\\d{2}\\d{2}$"
            },
            "integration": {
                "source": "generated",
                "reference": "siteplan_index + category + blok + nomor",
                "auto_generate": true
            }
        }
    };
}

// Test functions
function testHouseIdGeneration() {
    console.log('🧪 Testing House ID Generation...');
    
    // Test cases
    const testCases = [
        { siteplanIndex: 1, block: 'D02', number: '19', category: 'PLATINUM' },
        { siteplanIndex: 2, block: 'D02', number: '19', category: 'PLATINUM' },
        { siteplanIndex: 1, block: 'A01', number: '05', category: 'TITANIUM' },
        { siteplanIndex: 2, block: 'B03', number: '12', category: 'CROWN' }
    ];
    
    testCases.forEach((testCase, index) => {
        const houseId = generateHouseId(testCase.siteplanIndex, testCase.block, testCase.number, testCase.category);
        const parsed = parseHouseId(houseId);
        const isValid = validateHouseId(houseId);
        
        console.log(`Test ${index + 1}:`);
        console.log(`  Input: ${JSON.stringify(testCase)}`);
        console.log(`  House ID: ${houseId}`);
        console.log(`  Parsed: ${JSON.stringify(parsed, null, 2)}`);
        console.log(`  Valid: ${isValid}`);
        console.log('');
    });
}

// Export functions for Google Apps Script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SITEPLAN_DATA,
        UNIT_CATEGORIES,
        generateHouseId,
        parseHouseId,
        validateHouseId,
        getSiteplanByIndex,
        getSiteplanByPrefix,
        getSiteplanDropdownOptions,
        getUnitCategoryDropdownOptions,
        transformSiteplanIndex,
        transformHouseId,
        transformUnitCategory,
        transformPrefixLegal,
        autoGenerateHouseId,
        getHouseIdColumnMapping,
        testHouseIdGeneration
    };
}