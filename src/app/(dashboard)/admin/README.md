# Admin Dashboard Module

This module provides a comprehensive admin dashboard for managing company onboarding applications. It includes secure authentication, data visualization, and application management features.

## Features

### 🔐 Authentication
- Secure admin login with email/password
- Session management with "Remember Me" option
- Automatic logout and redirection

### 📊 Dashboard Overview
- Real-time statistics and metrics
- Visual representation of application status
- Trend indicators and counts

### 📋 Application Management
- Comprehensive table view of all applications
- Advanced filtering and search capabilities
- Sorting by multiple criteria
- Pagination with customizable page sizes

### 🔍 Detailed Reviews
- Complete company information display
- Document management and verification
- Contact and business details
- Banking information (when provided)

### ⚡ Actions
- Approve/Reject applications
- Status updates with admin notes
- Document download functionality
- Bulk operations support

## Folder Structure

```
src/app/pages/admin/
├── page.tsx                    # Main admin entry point
├── login/
│   └── page.tsx               # Admin login page
├── dashboard/
│   ├── page.tsx               # Main dashboard page
│   ├── components/
│   │   ├── StatsCards.tsx     # Dashboard statistics cards
│   │   └── CompaniesTable.tsx # Companies data table
│   └── modals/
│       └── CompanyDetailModal.tsx # Company detail modal
├── hooks/
│   └── useAdmin.ts            # Custom React hooks
├── types/
│   └── admin.types.ts         # TypeScript interfaces
├── utils/
│   └── admin.utils.ts         # Utility functions
└── styles/
    └── admin.scss             # Admin-specific styles
```

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/pages/admin`
2. You'll be redirected to login if not authenticated
3. Use the following demo credentials:
   - **Email**: admin@erp.com
   - **Password**: admin123
4. Upon successful login, you'll be redirected to the dashboard

### Managing Applications

1. **View Applications**: The main table displays all company applications
2. **Filter Data**: Use the filter controls to narrow down results
3. **View Details**: Click "View" to see complete company information
4. **Approve/Reject**: Use action buttons for pending applications
5. **Search**: Use the search bar to find specific companies

### Dashboard Features

- **Statistics Cards**: Overview of application counts and trends
- **Real-time Updates**: Data refreshes automatically
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Export Capabilities**: Download documents and reports

## Component Architecture

### Custom Hooks

- `useAdminAuth`: Handles authentication state and operations
- `useCompanyData`: Manages company data fetching and updates
- `useTableFilters`: Manages table filtering and pagination
- `useDashboardStats`: Calculates dashboard statistics
- `useModal`: Manages modal state and operations
- `useFormState`: Generic form state management

### Utilities

- `AdminUtils`: Helper functions for data processing
- Status color and text mapping
- Date formatting utilities
- Data filtering and sorting
- Mock data generation for development

### Types

- Comprehensive TypeScript interfaces
- Type safety for all data structures
- Form validation types
- API response types

## Styling

The admin module uses a custom SCSS file (`admin.scss`) with:
- Clean, modern design principles
- Ant Design theme integration
- Responsive breakpoints
- Dark mode support
- Print-friendly styles

## Security Features

- Form validation on login
- Session timeout handling
- Protected routes
- Input sanitization
- Error boundary protection

## Development

### Mock Data

The module includes a mock data generator for development:
- 50 sample company applications
- Various business types and statuses
- Realistic submission dates and contact information
- Document attachments with verification status

### Customization

1. **Styling**: Modify `admin.scss` for custom themes
2. **Data Source**: Replace mock data with real API calls
3. **Permissions**: Extend user roles and permissions
4. **Features**: Add new dashboard widgets and functionality

## Integration

### With Company Onboarding

The admin dashboard integrates with the company onboarding flow:
1. Companies submit applications through the onboarding form
2. Applications appear in the admin dashboard
3. Admins review and approve/reject applications
4. Companies receive status updates

### API Integration

To connect with a real backend:
1. Replace mock functions in `useCompanyData` hook
2. Update authentication logic in `useAdminAuth`
3. Implement real file upload/download
4. Add proper error handling for API failures

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance

- Lazy loading for large datasets
- Efficient re-rendering with React hooks
- Optimized table virtualization
- Image and document lazy loading

## Future Enhancements

- [ ] Role-based access control
- [ ] Advanced reporting and analytics
- [ ] Email notification system
- [ ] Bulk operations interface
- [ ] Audit trail and activity logs
- [ ] Integration with external services
- [ ] Mobile app companion

## Support

For questions or issues with the admin dashboard:
1. Check the component documentation
2. Review the type definitions
3. Examine the utility functions
4. Test with mock data first

## Contributing

When adding new features:
1. Follow the existing folder structure
2. Add proper TypeScript types
3. Include responsive styling
4. Write component documentation
5. Test with various data scenarios
