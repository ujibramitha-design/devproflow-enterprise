# Data Dictionary - KPRFlow Enterprise

## Overview

This document provides comprehensive data definitions, API documentation, and system architecture for the KPRFlow Enterprise system.

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Data Field Definitions](#data-field-definitions)
4. [Business Rules](#business-rules)
5. [System Architecture](#system-architecture)
6. [Integration Points](#integration-points)
7. [Security Considerations](#security-considerations)
8. [User Guide](#user-guide)

---

## Database Schema

### Table: customers

**Description**: Master table for customer information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique customer identifier |
| name | VARCHAR(100) | NOT NULL, MIN_LENGTH(3) | Customer full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE, EMAIL_FORMAT | Customer email address |
| phone | VARCHAR(20) | NOT NULL, PHONE_FORMAT | Customer phone number |
| nik | VARCHAR(16) | NOT NULL, UNIQUE, NIK_FORMAT | Indonesian NIK (16 digits) |
| birth_date | DATE | NOT NULL, AGE_BETWEEN(21,65) | Customer birth date |
| address | TEXT | NOT NULL, MIN_LENGTH(10) | Customer full address |
| monthly_income | DECIMAL(15,2) | MIN_VALUE(1000000) | Monthly income in IDR |
| occupation | VARCHAR(50) | OPTIONAL | Customer occupation |
| marital_status | VARCHAR(20) | ENUM('single','married','divorced','widowed') | Marital status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_customers_email` (email)
- `idx_customers_phone` (phone)
- `idx_customers_nik` (nik)

**Business Rules**:
- Email must be unique and valid format
- Phone must be in Indonesian format (+62xxxxxx)
- NIK must be 16 digits and unique
- Customer age must be between 21-65 years
- Monthly income minimum: Rp 1,000,000

---

### Table: properties

**Description**: Master table for property information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique property identifier |
| property_name | VARCHAR(200) | NOT NULL | Property name/title |
| property_type | VARCHAR(50) | NOT NULL, ENUM('residential','commercial','mixed') | Property type |
| location | TEXT | NOT NULL | Property location/address |
| city | VARCHAR(50) | NOT NULL | Property city |
| province | VARCHAR(50) | NOT NULL | Property province |
| price | DECIMAL(15,2) | NOT NULL, MIN_VALUE(50000000) | Property price in IDR |
| size | DECIMAL(10,2) | NOT NULL, MIN_VALUE(20) | Property size in square meters |
| bedrooms | INTEGER | MIN_VALUE(1) | Number of bedrooms |
| bathrooms | INTEGER | MIN_VALUE(1) | Number of bathrooms |
| status | VARCHAR(20) | DEFAULT 'available', ENUM('available','sold','reserved') | Property status |
| developer_id | UUID | FOREIGN KEY (developers.id) | Property developer |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_properties_type` (property_type)
- `idx_properties_location` (location)
- `idx_properties_price` (price)
- `idx_properties_status` (status)

**Business Rules**:
- Property price minimum: Rp 50,000,000
- Property size minimum: 20 m²
- Must have at least 1 bedroom and bathroom
- Status must be valid enum value

---

### Table: applications

**Description**: Loan application records

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique application identifier |
| customer_id | UUID | NOT NULL, FOREIGN KEY (customers.id) | Customer reference |
| property_id | UUID | NOT NULL, FOREIGN KEY (properties.id) | Property reference |
| application_date | DATE | NOT NULL | Application submission date |
| status | VARCHAR(20) | NOT NULL, ENUM('pending','approved','rejected','completed','cancelled') | Application status |
| loan_amount | DECIMAL(15,2) | NOT NULL, MIN_VALUE(10000000), MAX_VALUE(4000000000) | Loan amount in IDR |
| down_payment | DECIMAL(15,2) | NOT NULL, MIN_VALUE(0), MAX_VALUE(0.8 * price) | Down payment in IDR |
| tenure | INTEGER | NOT NULL, MIN_VALUE(1), MAX_VALUE(30) | Loan tenure in years |
| interest_rate | DECIMAL(5,2) | NOT NULL, MIN_VALUE(0), MAX_VALUE(20) | Interest rate percentage |
| monthly_installment | DECIMAL(15,2) | CALCULATED | Monthly installment amount |
| bank_id | UUID | FOREIGN KEY (banks.id) | Selected bank |
| notes | TEXT | OPTIONAL | Application notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_applications_customer` (customer_id)
- `idx_applications_property` (property_id)
- `idx_applications_status` (status)
- `idx_applications_date` (application_date)

**Business Rules**:
- Loan amount: Rp 10,000,000 - Rp 4,000,000,000
- Down payment maximum: 80% of property price
- Tenure: 1-30 years
- Interest rate: 0-20%
- Loan-to-Value ratio maximum: 80%

---

### Table: documents

**Description**: Document management records

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique document identifier |
| application_id | UUID | NOT NULL, FOREIGN KEY (applications.id) | Application reference |
| document_type | VARCHAR(50) | NOT NULL, ENUM('ktp','kk','salary_slip','bank_statement','tax_letter','marriage_certificate') | Document type |
| file_name | VARCHAR(255) | NOT NULL | Original file name |
| file_path | VARCHAR(500) | NOT NULL | Storage file path |
| file_size | INTEGER | NOT NULL, MAX_VALUE(25000000) | File size in bytes |
| mime_type | VARCHAR(100) | NOT NULL | File MIME type |
| status | VARCHAR(20) | DEFAULT 'uploaded', ENUM('uploaded','verified','rejected') | Document status |
| verification_notes | TEXT | OPTIONAL | Verification notes |
| uploaded_at | TIMESTAMP | DEFAULT NOW() | Upload timestamp |
| verified_at | TIMESTAMP | OPTIONAL | Verification timestamp |

**Indexes**:
- `idx_documents_application` (application_id)
- `idx_documents_type` (document_type)
- `idx_documents_status` (status)

**Business Rules**:
- File size maximum: 25MB
- Must be valid document type
- Status must be valid enum value

---

### Table: banks

**Description**: Bank information and configuration

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique bank identifier |
| bank_name | VARCHAR(100) | NOT NULL, UNIQUE | Bank name |
| bank_code | VARCHAR(10) | NOT NULL, UNIQUE | Bank code |
| api_endpoint | VARCHAR(255) | OPTIONAL | Bank API endpoint |
| api_key | VARCHAR(255) | OPTIONAL | Bank API key |
| max_loan_amount | DECIMAL(15,2) | NOT NULL | Maximum loan amount |
| min_down_payment | DECIMAL(5,2) | NOT NULL | Minimum down payment percentage |
| interest_rates | JSON | OPTIONAL | Interest rate tiers |
| processing_fee | DECIMAL(15,2) | DEFAULT 0 | Processing fee |
| status | VARCHAR(20) | DEFAULT 'active', ENUM('active','inactive') | Bank status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_banks_name` (bank_name)
- `idx_banks_code` (bank_code)
- `idx_banks_status` (status)

---

### Table: developers

**Description**: Property developer information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique developer identifier |
| developer_name | VARCHAR(100) | NOT NULL, UNIQUE | Developer name |
| founding_year | INTEGER | OPTIONAL, MIN_VALUE(1900) | Founding year |
| headquarters | VARCHAR(255) | OPTIONAL | Headquarters address |
| website | VARCHAR(255) | OPTIONAL | Website URL |
| stock_symbol | VARCHAR(10) | OPTIONAL | Stock symbol |
| market_position | VARCHAR(50) | OPTIONAL | Market position |
| specialization | VARCHAR(100) | OPTIONAL | Property specialization |
| total_projects | INTEGER | DEFAULT 0 | Total number of projects |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_developers_name` (developer_name)
- `idx_developers_specialization` (specialization)

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
**Description**: User authentication

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user_role"
  }
}
```

**Error Codes**:
- 400: Invalid credentials
- 401: Authentication failed
- 429: Too many attempts

---

#### POST /api/auth/refresh
**Description**: Refresh access token

**Request Body**:
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response**:
```json
{
  "access_token": "new_jwt_token_here",
  "expires_in": 3600
}
```

---

### Customer Endpoints

#### GET /api/customers
**Description**: Get all customers (with pagination)

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `status`: Customer status filter

**Response**:
```json
{
  "data": [
    {
      "id": "customer_id",
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "+628123456789",
      "nik": "3271010101010001",
      "birth_date": "2001-03-20",
      "address": "Customer Address",
      "monthly_income": 10000000,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

#### POST /api/customers
**Description**: Create new customer

**Request Body**:
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "08123456789",
  "nik": "3271010101010001",
  "birth_date": "2001-03-20",
  "address": "Customer Address",
  "monthly_income": 10000000,
  "occupation": "Software Engineer",
  "marital_status": "single"
}
```

**Response**:
```json
{
  "id": "new_customer_id",
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+628123456789",
  "nik": "3271010101010001",
  "birth_date": "2001-03-20",
  "address": "Customer Address",
  "monthly_income": 10000000,
  "occupation": "Software Engineer",
  "marital_status": "single",
  "created_at": "2026-03-21T10:00:00Z"
}
```

**Validation Rules**:
- Name: Required, min 3 characters
- Email: Required, valid email format, unique
- Phone: Required, Indonesian phone format
- NIK: Required, 16 digits, unique
- Birth Date: Required, age 21-65 years
- Address: Required, min 10 characters
- Monthly Income: Required, min Rp 1,000,000

---

#### GET /api/customers/{id}
**Description**: Get customer by ID

**Path Parameters**:
- `id`: Customer UUID

**Response**:
```json
{
  "id": "customer_id",
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+628123456789",
  "nik": "3271010101010001",
  "birth_date": "2001-03-20",
  "address": "Customer Address",
  "monthly_income": 10000000,
  "occupation": "Software Engineer",
  "marital_status": "single",
  "applications": [
    {
      "id": "application_id",
      "property_name": "Property Name",
      "status": "pending",
      "loan_amount": 400000000,
      "application_date": "2026-03-21"
    }
  ],
  "created_at": "2026-03-21T10:00:00Z",
  "updated_at": "2026-03-21T10:00:00Z"
}
```

---

#### PUT /api/customers/{id}
**Description**: Update customer information

**Path Parameters**:
- `id`: Customer UUID

**Request Body**:
```json
{
  "name": "Updated Name",
  "phone": "08123456789",
  "address": "Updated Address",
  "monthly_income": 12000000,
  "occupation": "Senior Software Engineer"
}
```

**Response**:
```json
{
  "id": "customer_id",
  "name": "Updated Name",
  "email": "customer@example.com",
  "phone": "+628123456789",
  "nik": "3271010101010001",
  "birth_date": "2001-03-20",
  "address": "Updated Address",
  "monthly_income": 12000000,
  "occupation": "Senior Software Engineer",
  "marital_status": "single",
  "updated_at": "2026-03-21T11:00:00Z"
}
```

---

### Application Endpoints

#### GET /api/applications
**Description**: Get all applications (with pagination)

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Application status filter
- `customer_id`: Customer filter
- `property_id`: Property filter

**Response**:
```json
{
  "data": [
    {
      "id": "application_id",
      "customer": {
        "id": "customer_id",
        "name": "Customer Name",
        "email": "customer@example.com"
      },
      "property": {
        "id": "property_id",
        "name": "Property Name",
        "type": "residential",
        "price": 500000000
      },
      "application_date": "2026-03-21",
      "status": "pending",
      "loan_amount": 400000000,
      "down_payment": 100000000,
      "tenure": 20,
      "interest_rate": 6.5,
      "monthly_installment": 2985000,
      "bank": {
        "id": "bank_id",
        "name": "Bank Name"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

---

#### POST /api/applications
**Description**: Create new loan application

**Request Body**:
```json
{
  "customer_id": "customer_id",
  "property_id": "property_id",
  "loan_amount": 400000000,
  "down_payment": 100000000,
  "tenure": 20,
  "bank_id": "bank_id",
  "notes": "Application notes"
}
```

**Response**:
```json
{
  "id": "new_application_id",
  "customer_id": "customer_id",
  "property_id": "property_id",
  "application_date": "2026-03-21",
  "status": "pending",
  "loan_amount": 400000000,
  "down_payment": 100000000,
  "tenure": 20,
  "interest_rate": 6.5,
  "monthly_installment": 2985000,
  "bank_id": "bank_id",
  "notes": "Application notes",
  "created_at": "2026-03-21T10:00:00Z"
}
```

**Validation Rules**:
- Customer ID: Required, valid UUID
- Property ID: Required, valid UUID
- Loan Amount: Required, Rp 10M - Rp 4B
- Down Payment: Required, max 80% of property price
- Tenure: Required, 1-30 years
- Bank ID: Required, valid UUID

---

### Property Endpoints

#### GET /api/properties
**Description**: Get all properties (with pagination)

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Property type filter
- `city`: City filter
- `status`: Status filter
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter

**Response**:
```json
{
  "data": [
    {
      "id": "property_id",
      "name": "Property Name",
      "type": "residential",
      "location": "Property Address",
      "city": "Serang",
      "province": "Banten",
      "price": 500000000,
      "size": 120.5,
      "bedrooms": 3,
      "bathrooms": 2,
      "status": "available",
      "developer": {
        "id": "developer_id",
        "name": "Developer Name"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

#### POST /api/properties
**Description**: Create new property

**Request Body**:
```json
{
  "name": "Property Name",
  "type": "residential",
  "location": "Property Address",
  "city": "Serang",
  "province": "Banten",
  "price": 500000000,
  "size": 120.5,
  "bedrooms": 3,
  "bathrooms": 2,
  "developer_id": "developer_id"
}
```

**Response**:
```json
{
  "id": "new_property_id",
  "name": "Property Name",
  "type": "residential",
  "location": "Property Address",
  "city": "Serang",
  "province": "Banten",
  "price": 500000000,
  "size": 120.5,
  "bedrooms": 3,
  "bathrooms": 2,
  "status": "available",
  "developer_id": "developer_id",
  "created_at": "2026-03-21T10:00:00Z"
}
```

---

### Document Endpoints

#### POST /api/documents/upload
**Description**: Upload document

**Request**:
- Content-Type: multipart/form-data
- `application_id`: Application UUID
- `document_type`: Document type
- `file`: File data

**Response**:
```json
{
  "id": "document_id",
  "application_id": "application_id",
  "document_type": "ktp",
  "file_name": "ktp_customer.jpg",
  "file_path": "/documents/application_id/ktp_customer.jpg",
  "file_size": 2048576,
  "mime_type": "image/jpeg",
  "status": "uploaded",
  "uploaded_at": "2026-03-21T10:00:00Z"
}
```

**Validation Rules**:
- Application ID: Required, valid UUID
- Document Type: Required, valid enum
- File: Required, max 25MB
- File Type: PDF, JPG, PNG

---

#### PUT /api/documents/{id}/verify
**Description**: Verify document

**Path Parameters**:
- `id`: Document UUID

**Request Body**:
```json
{
  "status": "verified",
  "verification_notes": "Document verified successfully"
}
```

**Response**:
```json
{
  "id": "document_id",
  "status": "verified",
  "verification_notes": "Document verified successfully",
  "verified_at": "2026-03-21T11:00:00Z"
}
```

---

## Data Field Definitions

### Customer Fields

| Field | Data Type | Format | Validation | Example |
|-------|-----------|--------|------------|---------|
| id | UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Required, Unique | 123e4567-e89b-12d3-a456-426614174000 |
| name | String | Text | Required, Min 3 chars | John Doe |
| email | String | email@example.com | Required, Email format, Unique | john@example.com |
| phone | String | +62xxxxxxxxxx | Required, Phone format | +628123456789 |
| nik | String | 16 digits | Required, 16 chars, Unique | 3271010101010001 |
| birth_date | Date | YYYY-MM-DD | Required, Age 21-65 | 2001-03-20 |
| address | Text | Text | Required, Min 10 chars | Jl. Example No. 123, Serang |
| monthly_income | Decimal | Number | Required, Min 1,000,000 | 10000000 |
| occupation | String | Text | Optional | Software Engineer |
| marital_status | Enum | single/married/divorced/widowed | Optional | single |

### Property Fields

| Field | Data Type | Format | Validation | Example |
|-------|-----------|--------|------------|---------|
| id | UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Required, Unique | 123e4567-e89b-12d3-a456-426614174001 |
| name | String | Text | Required, Max 200 chars | Rumah Tipe 120/120 |
| type | Enum | residential/commercial/mixed | Required | residential |
| location | Text | Text | Required | Jl. Property No. 456, Serang |
| city | String | Text | Required, Max 50 chars | Serang |
| province | String | Text | Required, Max 50 chars | Banten |
| price | Decimal | Number | Required, Min 50,000,000 | 500000000 |
| size | Decimal | Number | Required, Min 20 | 120.5 |
| bedrooms | Integer | Number | Required, Min 1 | 3 |
| bathrooms | Integer | Number | Required, Min 1 | 2 |
| status | Enum | available/sold/reserved | Required | available |

### Application Fields

| Field | Data Type | Format | Validation | Example |
|-------|-----------|--------|------------|---------|
| id | UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Required, Unique | 123e4567-e89b-12d3-a456-426614174002 |
| customer_id | UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Required, FK | 123e4567-e89b-12d3-a456-426614174000 |
| property_id | UUID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Required, FK | 123e4567-e89b-12d3-a456-426614174001 |
| application_date | Date | YYYY-MM-DD | Required | 2026-03-21 |
| status | Enum | pending/approved/rejected/completed/cancelled | Required | pending |
| loan_amount | Decimal | Number | Required, 10M-4B | 400000000 |
| down_payment | Decimal | Number | Required, Max 80% of price | 100000000 |
| tenure | Integer | Number | Required, 1-30 | 20 |
| interest_rate | Decimal | Number | Required, 0-20% | 6.5 |
| monthly_installment | Decimal | Number | Calculated | 2985000 |

---

## Business Rules

### Customer Business Rules

1. **Age Validation**: Customer must be between 21-65 years old
2. **Income Requirement**: Minimum monthly income of Rp 1,000,000
3. **Contact Information**: Email and phone must be unique and valid
4. **Identity Verification**: NIK must be 16 digits and unique
5. **Address Completeness**: Address must be at least 10 characters

### Property Business Rules

1. **Price Validation**: Property price minimum Rp 50,000,000
2. **Size Requirements**: Minimum property size 20 m²
3. **Facility Requirements**: Must have at least 1 bedroom and bathroom
4. **Location Validation**: City and province must be provided
5. **Status Management**: Property status must be valid enum value

### Application Business Rules

1. **Loan Amount**: Between Rp 10,000,000 and Rp 4,000,000,000
2. **Down Payment**: Maximum 80% of property price
3. **Loan Tenure**: Between 1 and 30 years
4. **Interest Rate**: Between 0% and 20%
5. **LTV Ratio**: Loan-to-Value maximum 80%
6. **Monthly Income**: Must support monthly installment (max 30% of income)

### Document Business Rules

1. **File Size**: Maximum 25MB per document
2. **File Types**: Only PDF, JPG, PNG allowed
3. **Required Documents**: KTP, KK, Salary Slip, Bank Statement
4. **Verification Process**: All documents must be verified
5. **Document Status**: Must follow valid status flow

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Web/Mobile)  │◄──►│   (Node.js)     │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   External      │
                       │   Services      │
                       │   (Drive, Email,│
                       │    Bank API)     │
                       └─────────────────┘
```

### Data Flow

1. **Customer Registration**
   - Frontend → Backend API → Database
   - Email notification sent
   - Welcome message sent

2. **Application Process**
   - Property selection → Application creation
   - Document upload → Verification
   - Bank submission → Status tracking

3. **Approval Workflow**
   - Application review → Decision
   - Document generation → Signing
   - Handover scheduling → Completion

### Security Architecture

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control
3. **Data Protection**: Encryption at rest and in transit
4. **API Security**: Rate limiting and input validation
5. **Audit Trail**: Complete logging of all operations

---

## Integration Points

### Supabase Integration

- **Authentication**: User login/logout
- **Database**: All data storage
- **Storage**: File uploads
- **Real-time**: Live updates
- **Functions**: Server-side logic

### Google Drive Integration

- **Document Storage**: Templates and files
- **Template Management**: Dynamic document generation
- **File Sharing**: Secure document access
- **Backup**: Document backup system

### Email Service Integration

- **Notifications**: System alerts
- **Communications**: Customer updates
- **Marketing**: Promotional content
- **Support**: Help desk communications

### Bank API Integration (Disabled)

- **Loan Submission**: Application forwarding
- **Status Updates**: Real-time tracking
- **Credit Scoring**: Risk assessment
- **Approval Process**: Decision management

---

## Security Considerations

### Data Protection

1. **PII Protection**: Personal information encryption
2. **Financial Data**: Sensitive financial information protection
3. **Document Security**: Secure file storage and access
4. **Audit Logging**: Complete audit trail

### Access Control

1. **User Roles**: Admin, Manager, Staff, Customer
2. **Permissions**: Granular access control
3. **API Keys**: Secure API key management
4. **Session Management**: Secure session handling

### Compliance

1. **Data Privacy**: GDPR-like compliance
2. **Financial Regulations**: Banking compliance
3. **Document Retention**: Legal document retention
4. **Audit Requirements**: Regulatory audit trails

---

## User Guide

### For Developers

1. **API Usage**: Follow RESTful API conventions
2. **Error Handling**: Implement proper error handling
3. **Data Validation**: Validate all input data
4. **Authentication**: Use proper authentication headers
5. **Rate Limiting**: Respect API rate limits

### For Business Users

1. **Customer Management**: Use customer management interface
2. **Application Processing**: Follow application workflow
3. **Document Management**: Upload required documents
4. **Reporting**: Use available reports and analytics
5. **Communication**: Use integrated communication tools

### For System Administrators

1. **User Management**: Manage user accounts and roles
2. **System Monitoring**: Monitor system performance
3. **Backup Management**: Regular backup procedures
4. **Security Management**: Maintain security settings
5. **Integration Management**: Manage external integrations

---

## Common Use Cases

### Customer Registration

1. Customer fills registration form
2. System validates input data
3. Customer record created in database
4. Welcome email sent
5. Initial application process started

### Loan Application

1. Customer selects property
2. Application form completed
3. Documents uploaded
4. Application submitted to bank
5. Status tracked throughout process

### Document Management

1. Required documents identified
2. Customer uploads documents
3. Documents verified by staff
4. Status updated in system
5. Notifications sent to customer

---

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check token validity
2. **Data Validation**: Verify input format
3. **File Upload**: Check file size and type
4. **API Errors**: Check API endpoint and parameters
5. **Database Errors**: Verify database connection

### Error Codes

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Server Error - Internal server error

### Support

For technical support:
- Check system logs
- Verify API configurations
- Test with sample data
- Contact development team

---

## FAQ

### General Questions

**Q: What is the maximum file size for document uploads?**
A: Maximum file size is 25MB per document.

**Q: What file types are supported for document uploads?**
A: Supported file types are PDF, JPG, and PNG.

**Q: How long does the application process take?**
A: Application processing typically takes 5-7 business days.

### Technical Questions

**Q: How do I authenticate with the API?**
A: Use JWT tokens obtained from the authentication endpoint.

**Q: What is the API rate limit?**
A: API rate limit is 1000 requests per hour globally.

**Q: How do I handle API errors?**
A: Check the error response for details and implement retry logic.

---

## Version History

- **v1.0.0** (2026-03-21): Initial version with complete data dictionary

---

*This document is maintained by the KPRFlow Enterprise development team. For updates and corrections, please contact the development team.*
