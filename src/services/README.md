
# Microservices Architecture

This directory contains the modular microservices architecture for the application. Each core business domain is encapsulated in its own service module with clearly defined interfaces.

## Directory Structure

```
/services
  /auth - Authentication and user management
  /billing - Subscription and payment processing
  /campaign - Campaign creation and management
  /analytics - Performance analysis and insights
  /ads - Ad platform integrations (Google, Meta, LinkedIn, Microsoft)
  /media - Media storage and image generation
  /credits - Credit management and tracking
  /libs - Shared libraries and utilities
    /supabase-client - Supabase client utilities
    /auth-helpers - Authentication helper functions
    /error-handling - Error handling utilities
    /api-client - API client utilities
```

## Microservices Principles

1. **Separation of Concerns**: Each domain is encapsulated in its own module/service.
2. **Limited Dependencies**: Services have minimal dependencies on each other.
3. **Clear Interfaces**: Services expose clear interfaces for other services to consume.
4. **Versioning**: API interfaces are versioned to allow smooth migrations.
5. **Error Handling**: Each service handles its own errors appropriately.

## Communication Patterns

Services communicate with each other through well-defined interfaces. Direct imports between services are minimized to maintain separation of concerns.

## Shared Libraries

Common utilities are abstracted into reusable libraries in the `/libs` directory. These include:

- Error handling
- API clients
- Authentication helpers
- Supabase client utilities

## Service Descriptions

- **Auth Service**: Handles user authentication, registration, and profile management.
- **Billing Service**: Manages subscriptions, payments, and invoices.
- **Campaign Service**: Handles campaign creation, optimization, and website analysis.
- **Analytics Service**: Provides performance metrics and AI-generated insights.
- **Ads Service**: Integrates with various ad platforms (Google, Meta, LinkedIn, Microsoft).
- **Media Service**: Handles media storage and AI image generation.
- **Credits Service**: Manages credit allocation, consumption, and tracking.

## Versioning

For major changes to service interfaces, version numbers should be used to ensure backward compatibility:

```typescript
// Example of versioned export
export const createCampaignV2 = async (params) => {
  // New implementation
};
```

## Testing

Each service should have its own set of unit tests focusing on its specific functionality.
