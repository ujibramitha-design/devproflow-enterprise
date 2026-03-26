# Shared Components

## Overview
Backend team components for KPRFlow Enterprise - Shared across all applications.

## Structure
- `api_clients/` - Supabase, WhatsApp, Firebase clients
- `services/` - Security, notification services
- `controllers/` - Application controller patterns
- `utils/` - Phone formatter, date calculator utilities
- `types/` - TypeScript type definitions
- `constants/` - API endpoints, validation rules
- `interfaces/` - Interface definitions
- `hooks/` - React hooks
- `contexts/` - React contexts
- `docs/` - Documentation

## Components Created

### API Clients
- **supabase-client.ts** - Supabase database client with CRUD operations
- **whatsapp-client.ts** - WhatsApp Business API client
- **firebase-client.ts** - Firebase authentication and database client

### Services
- **security-service.ts** - Security management, API key validation, rate limiting
- **notification-service.ts** - Multi-channel notification service (WhatsApp, Email, Push, SMS)

### Controllers
- **application-controller.ts** - Application CRUD operations with SLA tracking

### Utils
- **phone-formatter.ts** - Indonesian phone number formatting and validation
- **date-calculator.ts** - Date calculations, SLA tracking, business days

### Types
- **application-types.ts** - Application, Customer, Unit, Bank type definitions
- **notification-types.ts** - Notification system type definitions
- **common-types.ts** - Shared types (User, File, Location, etc.)

### Constants
- **api-endpoints.ts** - Centralized API endpoint definitions
- **validation-rules.ts** - Indonesian-specific validation rules

## Development
- IDE: VS Code
- Language: TypeScript/JavaScript
- Focus: Backend components shared across apps

## Usage Examples

### API Clients
```typescript
import { supabaseClient } from './api_clients/supabase-client'
import { whatsAppClient } from './api_clients/whatsapp-client'

// Initialize clients
supabaseClient.initialize({
  url: 'your-supabase-url',
  anonKey: 'your-anon-key'
})

whatsAppClient.initialize({
  apiKey: 'your-whatsapp-api-key',
  gatewayUrl: 'your-gateway-url'
})
```

### Services
```typescript
import { securityService } from './services/security-service'
import { notificationService } from './services/notification-service'

// Security validation
const validation = securityService.validateConfig()

// Send notification
await notificationService.sendNotification({
  title: 'Test Notification',
  message: 'This is a test',
  type: 'status_change'
})
```

### Utils
```typescript
import { formatPhoneForWhatsApp, validatePhoneNumber } from './utils/phone-formatter'
import { calculateAging, formatIndonesianDate } from './utils/date-calculator'

// Phone formatting
const whatsappPhone = formatPhoneForWhatsApp('08123456789')
const validation = validatePhoneNumber('08123456789')

// Date calculations
const aging = calculateAging('2024-01-01')
const formattedDate = formatIndonesianDate(new Date())
```

## Features

### Security Service
- API key management and validation
- Rate limiting
- Input sanitization
- Password hashing
- Security headers

### Notification Service
- Multi-channel support (WhatsApp, Email, Push, SMS)
- Template system
- Queue management
- Delivery tracking
- Bulk notifications

### Phone Formatter
- Indonesian phone number validation
- WhatsApp formatting
- Carrier detection
- Area code extraction
- Privacy masking

### Date Calculator
- Aging calculations
- Business day calculations
- SLA tracking
- Indonesian date formatting
- Holiday management

## Platform Compatibility

### Web (Next.js/React)
- ✅ All components compatible
- ✅ TypeScript support
- ✅ Modern browser APIs

### Mobile (React Native)
- ⚠️ Firebase client needs native modules
- ⚠️ File operations need native adapters
- ✅ Core logic compatible

### Desktop (Electron)
- ✅ All components compatible
- ✅ Node.js APIs available

## Dependencies

### Required
- TypeScript
- Supabase JS Client
- Node.js (for development)

### Optional
- Firebase SDK
- React (for hooks/contexts)
- Node.js runtime features

## Configuration

### Environment Variables
```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# WhatsApp
WA_API_KEY=your-whatsapp-api-key
WA_GATEWAY_URL=your-gateway-url

# Firebase
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_DATABASE_URL=your-database-url

# Other APIs
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

## Impact
⚠️ HATI-HATI: Update di folder ini = affect semua aplikasi (Mobile, Web, Desktop).

## Migration Notes

### From bramsray2 (Node.js Backend)
- ✅ Security service adapted
- ✅ WhatsApp engine adapted
- ✅ Controller patterns adapted
- ✅ API endpoints centralized
- ✅ Validation rules enhanced

### From bramsray1 (Google Apps Script)
- ✅ Date calculations adapted
- ✅ Indonesian formatting preserved
- ✅ Business logic patterns adapted

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Type Checking
```bash
npm run type-check
```

## Contributing

1. Follow TypeScript strict mode
2. Add comprehensive type definitions
3. Include JSDoc comments
4. Test cross-platform compatibility
5. Update documentation

## Version History

### v1.0.0 (Current)
- Initial shared components
- API clients for Supabase, WhatsApp, Firebase
- Security and notification services
- Indonesian-specific utilities
- Comprehensive type definitions

## Roadmap

### v1.1.0
- React Native adapters
- Enhanced error handling
- Performance optimizations
- Additional validation rules

### v1.2.0
- Offline support
- Caching layer
- Real-time synchronization
- Advanced analytics
