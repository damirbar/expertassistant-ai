# ExpertAssist AI

ExpertAssist AI is an innovative application designed to automate routine information-gathering calls to experts in the real estate industry. By leveraging AI technology, the application saves time, improves accuracy, and provides actionable summaries for real estate professionals.

## Overview

ExpertAssist AI allows real estate professionals to delegate routine calls to an AI assistant, which can gather specific information from experts such as realtors, lenders, attorneys, and inspectors. The system automatically calls the expert, navigates the conversation intelligently, and provides a detailed summary of the information obtained.

## Core Features

- **User Authentication**: Secure login and registration system for users to access their accounts.
- **Expert Management**: Add, edit, and organize your network of real estate experts.
- **Call Initiation**: Set up automated calls with specific goals and objectives.
- **AI-Powered Calling**: The AI handles the conversation, adapting to responses and gathering required information.
- **Call Tracking**: Monitor call status, listen to recordings, and view transcripts.
- **Summaries & Transcripts**: Get concise, actionable summaries of each call along with full transcripts.

## Technology Stack

- **Frontend**: React with TypeScript, Styled Components
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API for natural language processing
- **Telephony**: Twilio API for voice calling

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/expertassist-ai.git
   cd expertassist-ai
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

### Frontend Components

- **Authentication**
  - Login form for existing users
  - Registration form for new users
  - AuthContext for managing authentication state

- **Navigation**
  - Navbar with conditional rendering based on auth status
  - PrivateRoute for protecting authenticated routes

- **Dashboard**
  - Overview of recent calls and experts
  - Key metrics and quick access to main features

- **Experts Management**
  - ExpertsList: View and manage all experts
  - ExpertForm: Add or edit expert details with form validation

- **Calls Management**
  - CallsList: View all calls with filtering by status
  - CallDetails: Detailed view of call information including summary and transcript
  - CallInitiate: Multi-step process to start a new AI call

### Backend Structure

- **Controllers**: Handle request/response logic
- **Models**: Define data structures
- **Routes**: Define API endpoints
- **Services**: Implement business logic
- **Middleware**: Handle authentication, error handling, etc.

## Implementation Details

The application uses a modern React architecture with TypeScript for type safety. The UI is built with styled-components for consistent styling and theming. 

Key implementation features include:
- Context API for global state management
- React Router for navigation
- JWT authentication with secure HTTP-only cookies
- RESTful API design
- Simulated API responses for development (to be replaced with real API calls)
- Multi-step forms with validation
- Responsive design that works on mobile and desktop

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React
- TypeScript
- Node.js
- Express
- MongoDB
- OpenAI API
- Twilio API
- Styled Components
