# SITEPLAN DATA - KPRFlow Enterprise

## 🎯 House ID Generation System

### 📋 Overview
Complete siteplan integration with Prefix Legal House ID Generation System for KPRFlow Enterprise.

---

## 📊 Siteplan Information

### 🏗️ Siteplans Available
1. **Ciruas land** (Index: 1)
   - Prefix Legal: `SRG0310122020T002`
   - Year: 2020
   - Status: Active

2. **Ciruasland tahap 3** (Index: 2)
   - Prefix Legal: `SRG0310122024T001`
   - Year: 2024
   - Status: Active

---

## 🏷️ Unit Categories

| Category | Description | Level |
|----------|-------------|-------|
| PLATINUM | Premium | 1 |
| SKANDIUM | High-End | 2 |
| PALADIO | Luxury | 1 |
| TITANIUM | Ultra-Premium | 1 |
| GOLD | Standard Premium | 2 |
| CROWN | Luxury Elite | 1 |

---

## 🏠 House ID Format

### Structure
```
SRG031012YYYYTXXX[KATEGORI][BLOK][NOMOR]
```

### Components
- **SRG031012**: Fixed prefix
- **YYYY**: Year (2020, 2024)
- **XXX**: Siteplan code (001, 002)
- **KATEGORI**: Unit category (PLATINUM, SKANDIUM, PALADIO, TITANIUM, GOLD, CROWN)
- **BLOK**: Block identifier (A01, D02, etc.)
- **NOMOR**: Unit number (01-99)

---

## 📝 Examples

### Example 1: Ciruas land
- **Unit**: D02-19
- **Category**: PLATINUM
- **House ID**: `SRG0310122020T002PLATINUMD0219`

### Example 2: Ciruasland tahap 3
- **Unit**: A01-05
- **Category**: TITANIUM
- **House ID**: `SRG0310122024T001TITANIUMA0105`

---

## 🔧 Implementation

### Google Apps Script Integration
- **Column Mappings**: Updated with new fields
- **Functions**: Complete house ID generation system
- **Validation**: Pattern matching for all fields
- **Dropdown Options**: Pre-configured for siteplans and categories

### Supabase Integration
- **Table**: `data global master`
- **Fields**: siteplan_index, house_id, unit_category, prefix_legal
- **Validation**: Unique house IDs, range validation

---

## 📁 Files Structure

```
07_Raw_Materials_Data/
├── master siteplan.jpg (6.34 MB) - Master siteplan image
├── siteplan_data.json - Complete siteplan data structure
├── siteplan_integration.js - Integration functions
├── siteplan_data.md - This documentation
└── development_data/
    └── column_mappings.json - Updated column mappings
```

---

## 🚀 Usage

### Generate House ID
```javascript
// Using siteplan_integration.js
const houseId = generateHouseId(1, 'D02', '19', 'PLATINUM');
// Result: SRG0310122020T002PLATINUMD0219
```

### Parse House ID
```javascript
const parsed = parseHouseId('SRG0310122020T002PLATINUMD0219');
// Returns: { siteplan: 'Ciruas land', category: 'PLATINUM', block: 'D02', number: '19' }
```

### Validate House ID
```javascript
const isValid = validateHouseId('SRG0310122020T002PLATINUMD0219');
// Returns: true
```

---

## 📊 Features

### ✅ Implemented
- [x] 2 Siteplans with prefix legal
- [x] 6 Unit categories
- [x] House ID generation system
- [x] Google Apps Script integration
- [x] Supabase integration
- [x] Validation patterns
- [x] Dropdown options
- [x] Master siteplan image
- [x] Complete documentation

### 🔧 Ready for Production
- [x] High-quality siteplan image (6.34 MB)
- [x] Complete integration functions
- [x] Column mappings updated
- [x] Validation rules implemented
- [x] Test functions available

---

## 📞 Support

For questions or issues with the siteplan integration system:
- Check the `siteplan_integration.js` file for available functions
- Use `testHouseIdGeneration()` for testing
- Review column mappings in `development_data/column_mappings.json`

---

**🎉 Siteplan Integration Complete!**
**🚀 Production Ready!**