# DataTable Component

A highly customizable, type-safe, and performant data table component for React applications with built-in search, filtering, pagination, and error handling.

## Features

- ✅ **Type Safety**: Full TypeScript support with generic types
- ✅ **Search & Filtering**: Built-in search with debouncing and customizable filters
- ✅ **Pagination**: Smart pagination with configurable page sizes
- ✅ **Error Handling**: Comprehensive error states with retry functionality
- ✅ **Loading States**: Skeleton loading with configurable row count
- ✅ **Accessibility**: ARIA labels and keyboard navigation support
- ✅ **Customizable**: Custom renderers, row actions, and styling
- ✅ **Performance**: Optimized with React.memo, useCallback, and useMemo
- ✅ **Responsive**: Mobile-friendly design with responsive breakpoints

## Basic Usage

```tsx
import DataTable from '@/components/shared/tables/DataTable';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const columns: ColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { 
    key: 'role', 
    label: 'Role',
    render: (value) => <span className="capitalize">{value}</span>
  },
  { 
    key: 'createdAt', 
    label: 'Created',
    render: (value) => new Date(value).toLocaleDateString()
  }
];

function UsersTable() {
  return (
    <DataTable<User>
      endpoint="/api/users"
      columns={columns}
      searchTerm={true}
      filters={[
        {
          name: 'role',
          label: 'Filter by Role',
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' }
          ]
        }
      ]}
      rowActions={(user) => (
        <button onClick={() => editUser(user._id)}>Edit</button>
      )}
    />
  );
}
```

## Advanced Usage

### Custom Error and Empty States

```tsx
const CustomErrorComponent: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="text-center py-8">
    <p className="text-red-600 mb-4">Custom error message: {error.message}</p>
    <button onClick={retry} className="btn btn-primary">Try Again</button>
  </div>
);

const CustomEmptyState: React.FC = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">No users found</p>
    <button onClick={() => createUser()}>Create User</button>
  </div>
);

<DataTable<User>
  endpoint="/api/users"
  columns={columns}
  errorComponent={CustomErrorComponent}
  emptyStateComponent={CustomEmptyState}
/>
```

### Row Click Handlers

```tsx
<DataTable<User>
  endpoint="/api/users"
  columns={columns}
  onRowClick={(user) => {
    router.push(`/users/${user._id}`);
  }}
/>
```

### Custom Styling

```tsx
<DataTable<User>
  endpoint="/api/users"
  columns={columns}
  className="custom-table-styles"
  initialPageSize={20}
  loadingRows={10}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | - | API endpoint to fetch data from |
| `columns` | `ColumnConfig<T>[]` | - | Column configuration array |
| `filters` | `FilterConfig[]` | `[]` | Filter configuration array |
| `status` | `string` | - | Additional status parameter for API |
| `searchTerm` | `boolean` | `true` | Enable/disable search functionality |
| `rowActions` | `(row: T) => React.ReactNode` | - | Function to render row actions |
| `onRowClick` | `(row: T) => void` | - | Callback when row is clicked |
| `className` | `string` | `''` | Additional CSS classes |
| `initialPageSize` | `number` | `10` | Number of items per page |
| `errorComponent` | `React.ComponentType` | `DefaultErrorComponent` | Custom error component |
| `emptyStateComponent` | `React.ComponentType` | `DefaultEmptyStateComponent` | Custom empty state component |
| `loadingRows` | `number` | `5` | Number of skeleton rows to show |

### Types

#### ColumnConfig<T>
```tsx
interface ColumnConfig<T extends BaseRow = BaseRow> {
  key: keyof T;                    // Property key from data object
  label: string;                   // Display label for column
  render?: (value: T[keyof T], row: T) => React.ReactNode; // Custom renderer
  sortable?: boolean;              // Enable sorting (future feature)
  width?: string;                  // Column width (CSS value)
}
```

#### FilterConfig
```tsx
interface FilterConfig {
  name: string;                    // Filter parameter name
  label: string;                   // Display label for filter
  options: Array<{                 // Filter options
    value: string;
    label: string;
  }>;
}
```

#### BaseRow
```tsx
interface BaseRow {
  _id?: string;                    // Optional unique identifier
  [key: string]: any;              // Additional properties
}
```

## API Response Format

The component expects the API to return data in this format:

```tsx
interface DataTableResponse<T> {
  data: T[];                       // Array of data items
  pagination: {
    total: number;                 // Total number of items
    page: number;                  // Current page number
    limit: number;                 // Items per page
  };
}
```

### Query Parameters

The component automatically sends these query parameters to your API:

- `search`: Search term (if provided)
- `page`: Current page number
- `limit`: Items per page
- `status`: Status filter (if provided)
- Custom filter parameters (from `filters` prop)

## Best Practices

### 1. Type Safety
Always define proper interfaces for your data:

```tsx
interface User extends BaseRow {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}
```

### 2. Performance
- Use `useCallback` for custom renderers if they're complex
- Keep column configurations outside the component to prevent re-renders
- Use `React.memo` for custom components passed as props

### 3. Error Handling
- Provide meaningful error messages
- Implement retry logic in your error components
- Handle different types of errors appropriately

### 4. Accessibility
- Always provide `aria-label` for interactive elements
- Ensure keyboard navigation works properly
- Use semantic HTML elements

### 5. Styling
- Use Tailwind CSS classes for consistent styling
- Override styles using the `className` prop
- Maintain responsive design principles

## Examples

### Property Management Table
```tsx
interface Property extends BaseRow {
  _id: string;
  title: string;
  address: string;
  price: number;
  status: 'available' | 'rented' | 'maintenance';
  createdAt: string;
}

const propertyColumns: ColumnConfig<Property>[] = [
  { key: 'title', label: 'Property Name' },
  { key: 'address', label: 'Address' },
  { 
    key: 'price', 
    label: 'Price',
    render: (value) => `$${value.toLocaleString()}`
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'available' ? 'bg-green-100 text-green-800' :
        value === 'rented' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )
  }
];

<DataTable<Property>
  endpoint="/api/properties"
  columns={propertyColumns}
  filters={[
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'rented', label: 'Rented' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    }
  ]}
  rowActions={(property) => (
    <div className="flex gap-2">
      <button onClick={() => editProperty(property._id)}>Edit</button>
      <button onClick={() => viewDetails(property._id)}>View</button>
    </div>
  )}
/>
```

## Migration from v1

If you're upgrading from the previous version:

1. **Type Safety**: Add proper interfaces extending `BaseRow`
2. **Filter Options**: Update filter options to use `{ value, label }` format
3. **Error Handling**: The component now has built-in error handling
4. **Performance**: No changes needed, but consider using the new props for better customization

## Contributing

When contributing to this component:

1. Maintain type safety
2. Add proper error handling
3. Include accessibility features
4. Write comprehensive tests
5. Update documentation
6. Follow the existing code style 