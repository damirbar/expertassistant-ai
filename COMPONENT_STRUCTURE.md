# ExpertAssist AI - Component Structure

This document outlines the structure and purpose of the main components in the ExpertAssist AI application.

## Application Structure

```
src/
│
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Application navigation bar
│   └── PrivateRoute.tsx   # Route protection for authenticated users
│
├── context/               # React context providers
│   └── AuthContext.tsx    # Authentication state management
│
├── pages/                 # Main application pages
│   ├── Auth/              # Authentication related pages
│   │   ├── Login.tsx      # User login form
│   │   └── Register.tsx   # User registration form
│   │
│   ├── Calls/             # Call management pages
│   │   ├── CallsList.tsx  # List of all calls with filtering
│   │   ├── CallDetails.tsx# Detailed view of a specific call
│   │   └── CallInitiate.tsx# Wizard for starting a new call
│   │
│   ├── Experts/           # Expert management pages
│   │   ├── ExpertsList.tsx# Grid view of all experts
│   │   ├── ExpertForm.tsx # Form for adding/editing experts
│   │   └── types.ts       # TypeScript types for experts
│   │
│   └── Dashboard.tsx      # Main dashboard with statistics
│
└── App.tsx                # Main application component with routes
```

## Component Descriptions

### Core Components

- **App.tsx** - The root component that sets up routing and global providers. Contains all route definitions and wraps the application in the AuthProvider.

- **AuthContext.tsx** - Provides authentication state and functions throughout the application. Manages user login, registration, and logout functionality.

- **PrivateRoute.tsx** - A wrapper component that protects routes requiring authentication. Redirects to login if the user is not authenticated.

- **Navbar.tsx** - The application's navigation bar that adapts based on authentication status. Shows different navigation options for logged-in vs. anonymous users.

### Authentication Components

- **Login.tsx** - A form component that handles user login. Validates inputs, submits credentials to the API, and redirects on success.

- **Register.tsx** - A form component for new user registration with validation for required fields, password matching, and email format.

### Dashboard

- **Dashboard.tsx** - The main landing page after login, showing key statistics and recent activity. Provides quick access to important features.

### Experts Management

- **ExpertsList.tsx** - Displays a grid of experts with filtering options. Each expert card shows essential information and provides actions for editing or initiating calls.

- **ExpertForm.tsx** - A form for adding new experts or editing existing ones. Includes validation and handling of different expert types.

- **types.ts** - Contains TypeScript interfaces and enums for expert data, including the `ExpertType` enum.

### Calls Management

- **CallsList.tsx** - A table view of all calls with status filtering. Shows key information about each call and provides links to detailed views.

- **CallDetails.tsx** - A detailed view of a specific call, including metadata, summary, transcript, and notes. Allows adding notes and retrying failed calls.

- **CallInitiate.tsx** - A multi-step wizard for starting new AI calls. Guides the user through selecting an expert, defining a goal, and confirming details.

## Design Patterns

The application follows these key design patterns:

1. **Component-Based Architecture** - The UI is broken down into reusable components with clear responsibilities.

2. **Context API for State Management** - Global state like authentication is managed through React Context.

3. **Route-Based Code Organization** - Components are organized by their route/page structure.

4. **Type-Safe Development** - TypeScript interfaces and types ensure data consistency.

5. **Container/Presentational Pattern** - Many components separate data fetching/logic from presentation.

6. **Responsive Design** - Components adapt to different screen sizes using styled-components.

## Styling Approach

The application uses styled-components for styling, with consistent colors, spacing, and typography. Key UI elements include:

- Cards for containing related information
- Tables for data-heavy views
- Forms with consistent styling and validation
- Status badges for visual state indication
- Responsive layouts that work on mobile and desktop

The color scheme focuses on professional blues and grays with accent colors to indicate status and actions. 