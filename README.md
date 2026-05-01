# NaijaRentVerify Frontend

A modern, responsive property management platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Property Management**: Complete property listing and management system
- **Tenant Screening**: Comprehensive background verification and screening
- **Rent Collection**: Automated rent payment processing
- **Maintenance Tracking**: Request and track property maintenance
- **Document Management**: Secure document storage and sharing
- **Real-time Messaging**: Built-in communication system
- **Dashboard Analytics**: Financial and property performance insights
- **Multi-role Support**: Landlord and tenant portals

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Radix UI + Custom Components
- **Charts**: Recharts & Chart.js
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React + React Icons
- **Date Handling**: date-fns + dayjs
- **File Upload**: Custom implementation with progress tracking

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nrv-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXT_PUBLIC_YOUVERIFY_API_URL=https://api.youverify.co/v2/api/identity/ng/bvn

# Optional: Analytics and monitoring
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
nrv-frontend/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── charts/              # Chart components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── guard/               # Route protection components
│   │   ├── icons/               # Custom icons
│   │   ├── layout/              # Layout components
│   │   ├── loaders/             # Loading states
│   │   ├── maintainance/        # Maintenance components
│   │   ├── property-dashboard/  # Property management
│   │   ├── room-dashboard/      # Room management
│   │   ├── screens/             # Page components
│   │   ├── shared/              # Shared UI components
│   │   └── verification/        # Verification components
│   ├── dashboard/               # Dashboard pages
│   │   ├── landlord/            # Landlord dashboard
│   │   └── tenant/              # Tenant dashboard
│   └── [other pages]/           # Other app pages
├── components/                   # Global UI components
│   └── ui/                      # Base UI components
├── config/                      # Configuration files
├── helpers/                     # Utility functions
├── lib/                         # Core libraries and hooks
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
├── redux/                       # State management
│   ├── slices/                  # Redux slices
│   ├── hooks.ts                 # Typed Redux hooks
│   └── store.ts                 # Store configuration
├── types/                       # TypeScript type definitions
└── [config files]               # Configuration files
```

## 🎨 Design System

### Colors

The application uses a custom color palette defined in `tailwind.config.ts`:

- **Primary Green**: `#03442C` (nrvPrimaryGreen)
- **Gold**: `#FFB94E` (nrvGold)
- **Grey Black**: `#333333` (nrvGreyBlack)
- **Light Grey**: `#999999` (nrvLightGrey)

### Typography

- **Font Family**: Plus Jakarta Sans
- **Weights**: 300, 400, 500, 600, 700

### Components

The application uses a combination of:
- **Radix UI**: For accessible base components
- **Custom Components**: Built on top of Radix UI
- **Tailwind CSS**: For styling and responsive design

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Structure

```typescript
// Component template
import React from 'react';
import { ComponentProps } from '@/types';

interface ComponentNameProps {
  // Define props
}

const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {
  // Component logic
  
  return (
    // JSX
  );
};

export default ComponentName;
```

### State Management

- Use Redux Toolkit for global state
- Use React hooks for local state
- Use the custom `useApi` hook for API calls
- Implement proper loading and error states

### API Integration

```typescript
// Example API usage
import { useGet } from '@/lib/hooks/useApi';
import { Property } from '@/types';

const MyComponent = () => {
  const { data, loading, error, execute } = useGet<Property[]>('/properties', {
    cacheKey: 'properties',
    onSuccess: (data) => console.log('Properties loaded:', data),
    onError: (error) => console.error('Failed to load properties:', error),
  });

  // Component logic
};
```

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error boundaries
- Show user-friendly error messages
- Log errors for debugging

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API calls
- Write component tests for complex UI logic
- Maintain good test coverage

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_YOUVERIFY_API_URL=https://api.youverify.co/v2/api/identity/ng/bvn
```

### Deployment Platforms

The application can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📚 API Documentation

### Authentication

All API requests require authentication via Bearer token:

```typescript
// Token is automatically added via axios interceptors
const response = await apiService.get('/protected-endpoint');
```

### Common Endpoints

- `POST /auth/login` - User login
- `POST /users` - User registration
- `GET /properties` - Get properties
- `POST /properties` - Create property
- `GET /maintenance` - Get maintenance requests
- `POST /maintenance` - Create maintenance request

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Use conventional commit messages:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Core property management features
- Tenant screening system
- Rent collection functionality
- Maintenance tracking
- Document management
- Real-time messaging
- Dashboard analytics

---

**Built with ❤️ by the NaijaRentVerify Team**
