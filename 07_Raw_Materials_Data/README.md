# Raw Materials Data

## Overview
Data team materials for KPRFlow Enterprise - Complete data foundation for enterprise operations.

## Structure
- `reference_data/` - Static reference data (provinces, cities, banks, property types)
- `master_data/` - Business master data (developers, property specifications, unit types)
- `configuration/` - System configuration and business rules
- `templates/` - Communication templates (email, WhatsApp, SMS, push notifications)
- `development_data/` - Sample data for testing and development
- `material_prices/` - Construction material prices with supplier information
- `property_data/` - Property data (clusters, unit specifications, developers)
- `market_data/` - Market analysis and competitor intelligence
- `validation_rules/` - Data validation rules and quality standards
- `data_quality/` - Data cleaning rules and quality management
- `integration_data/` - API mappings and data transformations
- `docs/` - Complete documentation and data dictionary

## Development
- IDE: VS Code
- Format: JSON, CSV, SQL
- Focus: Data management foundation - supports application code

## Impact
Data update = tidak affect code, hanya data yang berubah.

## Status: COMPLETED ✅

### ✅ Priority 1 (Foundation Data)
- `reference_data/provinces.json` - 38 provinces Indonesia complete
- `master_data/banks.json` - 10 banks with KPR programs
- `configuration/business_rules.json` - Complete business rules
- `validation_rules/field_validations.json` - Comprehensive validation rules

### ✅ Priority 2 (Workflow & Templates)
- `configuration/workflow_tracking.json` - 3 complete workflows
- `templates/status_templates.json` - 25 status templates
- `templates/notification_templates.json` - Multi-channel notifications
- `configuration/user_roles.json` - 8 user roles with permissions
- `configuration/notification_settings.json` - 5 channel notification system
- `templates/email_templates/` - Professional email templates
- `templates/document_templates/` - Legal document templates

### ✅ Priority 3 (Advanced Data)
- `property_data/cluster_data.json` - 6 clusters from Ciruas Land
- `property_data/unit_specifications.json` - 7 unit types complete
- `master_data/developers.json` - 3 developers with full profiles
- `material_prices/construction_materials.json` - 8 materials with suppliers
- `market_data/property_market.json` - 5 regions + competitor analysis

### ✅ Quality & Integration
- `data_quality/data_cleaning_rules.json` - 25 cleaning rules
- `integration_data/api_mappings.json` - Complete API integration mappings
- `docs/data_dictionary.md` - Complete data documentation

## Data Sources Best Combination
- **70% BRV3** (Ciruas Land Database) - Property & market data
- **20% BRV2** (API Structure) - Integration patterns
- **10% BRV1** (Validation) - Quality rules & logic

## Total Files Created: 22
- **Reference Data:** 1 file
- **Master Data:** 3 files  
- **Configuration:** 4 files
- **Templates:** 5 files
- **Development Data:** 2 files
- **Material Prices:** 1 file
- **Property Data:** 2 files
- **Market Data:** 1 file
- **Validation Rules:** 1 file
- **Data Quality:** 1 file
- **Integration Data:** 1 file
- **Documentation:** 1 file

## Integration Ready
All data is structured for easy integration with:
- Supabase Database
- Google Sheets API
- WhatsApp Business API
- Email Services
- Push Notifications
- External APIs

## Usage
This data foundation supports:
- Application processing
- Customer management
- Property valuation
- Market analysis
- Compliance reporting
- Business intelligence

## Last Updated: 2026-03-20
## Status: ✅ COMPLETE
