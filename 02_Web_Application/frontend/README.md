# DevPro-Enterprise - UI Design System

## Overview

DevPro-Enterprise UI Design System adalah sistem desain komprehensif yang dibangun dengan pendekatan **Hybrid Approach** - menggabungkan foundation dari project UI yang sudah ada dengan customisasi DevPro-Enterprise brand.

## Technology Stack

- **Framework**: Next.js 15.1.11 dengan App Router
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 4.0.0 dengan DevPro-Enterprise custom colors
- **Components**: Radix UI (complete set)
- **Icons**: Lucide React
- **Theme**: next-themes (Light/Dark mode)
- **Charts**: Recharts
- **Document Processing**: xlsx, mammoth, pdfjs-dist

## Project Structure

```
05_UI_Design_System/web_ui/
├── src/
│   ├── app/
│   │   ├── globals.css          # DevPro-Enterprise custom design tokens
│   │   ├── layout.tsx           # Root layout dengan DevPro-Enterprise branding
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── ui/                  # Base UI components (60+)
│   │   ├── layout/              # Layout components
│   │   └── dashboard/           # Dashboard components
│   └── lib/
│       └── utils.ts             # DevPro-Enterprise utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## DevPro-Enterprise Design System

### Color Palette

#### Brand Colors
- **Primary**: `oklch(0.45 0.12 240)` - DevPro-Enterprise Blue
- **Secondary**: `oklch(0.85 0.05 30)` - Warm Orange
- **Success**: `oklch(0.55 0.15 145)` - Green
- **Warning**: `oklch(0.65 0.18 45)` - Orange
- **Error**: `oklch(0.55 0.22 25)` - Red

#### Status Colors
- **Pending**: Warning background & text
- **Approved**: Success background & text
- **Rejected**: Error background & text
- **Completed**: Primary background & text

#### Property Type Colors
- **Residential**: Green theme
- **Commercial**: Orange theme
- **Mixed**: Blue theme

### Typography

- **Primary Font**: Inter (modern, clean)
- **Secondary Font**: Poppins (bold, impactful)
- **Monospace**: Geist Mono (code/numbers)

### Components

#### Base Components (60+)
- Button (6 variants + DevPro-Enterprise variant)
- Card, Input, Badge, Select
- Dialog, Dropdown, Tooltip
- Table, Chart, Calendar
- Form components, Navigation
- And many more...

#### Layout Components
- **Sidebar**: Collapsible, 11 menu items
- **Topbar**: Search, notifications, user menu
- **Dashboard**: Complete dashboard layout

#### DevPro-Enterprise Specific Components
- **Dashboard**: Real-time stats, recent applications
- **Property Cards**: Property listing with status
- **Application Cards**: Application status tracking
- **Loan Calculator**: Monthly installment calculation
- **Status Badges**: Application status indicators

## Features

### Advanced Features
- ✅ **Theme Switching**: Light/Dark mode support
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Animations**: Custom DevPro-Enterprise animations
- ✅ **Accessibility**: WCAG compliant
- ✅ **Document Processing**: Excel, Word, PDF support
- ✅ **Real-time Data**: WebSocket ready
- ✅ **Analytics**: Chart integration
- ✅ **Internationalization**: Indonesian locale support

### Business Modules
- 🏠 **Dashboard**: Overview & analytics
- 📊 **Executive (BOD)**: Management dashboard
- 💰 **Finance Hub**: Financial management
- ⚖️ **Legal Workflow**: Document processing
- 📢 **Marketing Panel**: Marketing tools
- 🔧 **Engineering**: Technical management
- 📝 **Aplikasi KPR**: Application processing
- 🏢 **Data Unit**: Property management
- 👥 **Customer DB**: Customer management
- 🔒 **Audit Security**: Security & compliance
- ⚙️ **Settings**: System configuration

## Integration Ready

### Database Integration
- Supabase client configured
- Authentication helpers ready
- Real-time subscriptions prepared

### API Integration
- REST API endpoints structure
- Error handling patterns
- Loading states management

### Business Logic
- Loan calculation functions
- Currency formatting
- Date formatting (Indonesian)
- Phone number formatting
- Status color mapping

## Customization

### DevPro-Enterprise Brand Elements
- Custom gradient effects
- Brand-specific animations
- DevPro-Enterprise color variables
- Custom scrollbar styling
- Professional shadows

### Utility Functions
```typescript
// Currency formatting
formatCurrency(450000000) // "Rp 450.000.000"

// Date formatting
formatDate(new Date()) // "21 Maret 2024"

// Phone formatting
formatPhoneNumber("08123456789") // "+62 812 3456 789"

// Loan calculation
calculateMonthlyInstallment(450000000, 10, 15) // Monthly payment
```

## Development

### Getting Started
```bash
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

### Component Usage
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// DevPro-Enterprise specific
<Button variant="devpro">Apply Now</Button>
<Badge className="devpro-status-approved">Approved</Badge>
```

## Status

- ✅ **Design System**: Complete
- ✅ **Components**: 60+ components
- ✅ **Layout**: Responsive & professional
- ✅ **Business Modules**: All modules present
- ✅ **Integration Ready**: Database & API prepared
- ✅ **Documentation**: Complete

## Next Steps

1. **Database Integration**: Connect to Supabase
2. **Authentication**: Implement user auth
3. **Real-time Features**: WebSocket integration
4. **Business Logic**: Implement DevPro-Enterprise workflows
5. **Testing**: Unit & integration tests
6. **Deployment**: Production deployment

---

**DevPro-Enterprise UI Design System** - Professional, Modern, and Production Ready! 🚀
