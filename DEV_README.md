# ExpertAssist AI - Development Mode

## Overview
This application has been configured to run in a development environment without requiring MongoDB. Instead, it uses mock data and local storage to simulate a backend.

## Mock Authentication
The application uses a simplified authentication system for development:

- **Demo User**: A demo user account is pre-configured with the following credentials:
  - Email: `demo@example.com`
  - Password: `password123`

- **Local Storage**: User authentication state is persisted in your browser's localStorage under the key `expertAssistUser`.

- **Registration**: You can register new users, but they will only persist during the current browser session.

## Features Available in Mock Mode

The following features are fully functional in mock mode:

- **Authentication**: Login, registration, and user session management.
- **Dashboard**: View mock statistics and recent calls.
- **Experts Management**: List, add, and edit experts (data stored in memory).
- **Call Management**: View, filter, and simulate creating new calls.

## Simulated API Calls

All API calls have been replaced with simulated responses that return after a short delay (usually 1 second) to mimic network requests. No actual API requests are made to a backend.

## How to Use

1. **Start the application**:
   ```
   npm start
   ```

2. **Login options**:
   - Use the demo account: `demo@example.com` / `password123`
   - Or click the "Use Demo Account" button on the login page
   - Or register a new account (will persist only for the current session)

3. **Navigate the application** as you normally would.

## Known Limitations

- Data does not persist between page refreshes (except authentication state).
- All API responses are pre-programmed mock data.
- Changes to experts or calls will appear to work but reset when the page is refreshed.

## Moving to Production

When you're ready to move to a production environment with real data:

1. Uncomment the real API calls in the service files
2. Set up the MongoDB connection as specified in the main README
3. Configure the environment variables for your backend services 