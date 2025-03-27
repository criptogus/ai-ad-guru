
# Microservices Architecture

This application is structured using a modular microservices architecture to ensure scalability, separation of concerns, and safe updates.

## Directory Structure

```
/services
  /auth - Authentication and user management
  /billing - Payment processing and subscription management
  /campaign - Campaign creation and management
  /analytics - Performance tracking and insights
  /ads - Ad platform integrations (Google, Meta, LinkedIn, Microsoft)
  /media - Media generation and management
  /credits - Credit system management
  /libs - Shared utilities and helpers
    /supabase-client - Supabase client wrapper
    /auth-helpers - Authentication helper functions
    /error-handling - Error handling utilities
    /api-client - HTTP client wrapper
  /team - Team management (legacy)
```

## Service Boundaries

Each service is isolated and encapsulates a specific domain of functionality:

### Auth Service
- User authentication
- User registration
- Session management
- User profile management

### Billing Service
- Subscription management
- Payment processing
- Invoice generation
- Stripe integration

### Campaign Service
- Campaign creation
- Campaign management
- Website analysis
- Campaign optimization

### Analytics Service
- Performance tracking
- Insights generation
- Reporting
- Data visualization

### Ads Service
- Ad generation
- Ad platform integrations
- Ad optimization
- Account connections

### Media Service
- Image generation
- Media storage
- Asset management
- File handling

### Credits Service
- Credit management
- Credit usage tracking
- Credit purchase
- Credit allocation

## Communication Between Services

Services communicate through well-defined interfaces:

1. **Direct method calls** for synchronous operations within the frontend
2. **Supabase database** for persistent data storage and retrieval
3. **Supabase edge functions** for asynchronous and server-side operations

## Development Guidelines

1. **Maintain Service Isolation**: Services should not directly depend on each other's implementation details. Use the public APIs exposed by each service.

2. **API Versioning**: When making breaking changes to a service's API, version the API (e.g., v1, v2) to allow for smooth migrations.

3. **Error Handling**: Each service should handle its own errors and provide meaningful error messages to consumers.

4. **Testing**: Write unit tests for each service in isolation. Write integration tests for interactions between services.

5. **Documentation**: Keep this README updated with any architectural changes. Document each service's API and responsibilities.

## Adding New Features

When adding new features:

1. Identify which service the feature belongs to
2. Implement the feature within that service's boundary
3. If the feature crosses service boundaries, design clear interfaces for communication
4. Update tests and documentation
