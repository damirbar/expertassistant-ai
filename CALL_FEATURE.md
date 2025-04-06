# ExpertAssist AI - Call Feature Guide

## Overview
The Call Feature allows you to initiate automated information-gathering calls to experts in your network. This guide will help you understand how to use this feature, whether in demo mode or with real Twilio integration.

## Using the Call Feature in Demo Mode

By default, the application runs in "Demo Mode," which simulates calls without actually making them. This is useful for testing and development without requiring Twilio credentials.

To initiate a call in demo mode:

1. Log in to the ExpertAssist AI application
2. Navigate to the "Calls" page
3. Click "Initiate New Call"
4. Follow the three-step process:
   - Select an expert from your list (add experts first if none are available)
   - Define the goal of the call
   - Review and confirm the call details
5. Click "Initiate Call" to start the simulated call
6. You will be redirected to the Call Details page showing the simulated call progress

In demo mode, the call status will automatically cycle through different states to simulate a real call.

## Setting Up Real Calls with Twilio

To make real calls using Twilio:

### Prerequisites
1. A Twilio account (sign up at https://www.twilio.com)
2. A Twilio phone number capable of making outbound calls
3. Your Twilio Account SID and Auth Token (found in your Twilio dashboard)

### Configuration
1. Open the `.env` file in the server directory of the application
2. Update the following values with your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_actual_account_sid
   TWILIO_AUTH_TOKEN=your_actual_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   DEMO_MODE=false
   ```
3. Restart the server for the changes to take effect

### Important Notes About Twilio Credentials
- Your Twilio Account SID **must** start with "AC" - this is Twilio's standard format
- If the Account SID doesn't start with "AC", the application will fall back to demo mode
- API Keys (which start with "SK") cannot be used directly as the Account SID
- You can find your Account SID and Auth Token in your Twilio Console dashboard

### Making Real Calls
Once configured, follow the same steps as in demo mode. The application will now make actual calls to your experts using Twilio.

## Troubleshooting Common Issues

### Connection Issues
**Problem**: "Cannot connect to the server" error when initiating a call

**Solutions**:
- Make sure both the frontend and backend servers are running
- Check that the server is running on port 5000 (default configuration)
- Verify there are no CORS issues

### CORS Errors
**Problem**: CORS policy errors in the browser console

**Solutions**:
- Make sure the server is running with proper CORS configuration
- The server should accept requests from your frontend origin (e.g., http://localhost:3000)
- If working in a development environment with changing origins, you may need to update CORS settings

### Twilio Authentication Errors
**Problem**: Errors related to Twilio authentication when making real calls

**Solutions**:
- Verify that your Twilio credentials in the `.env` file are correct
- **Make sure your Account SID starts with "AC"** (this is required)
- Check that your Twilio account is active and has sufficient credits
- Ensure your Twilio phone number can make outbound calls
- Verify that DEMO_MODE is set to false when you want to make real calls

### Call Not Being Initiated
**Problem**: The call doesn't go through to the expert

**Solutions**:
- Check that the expert phone number is in a valid format (Twilio requires E.164 format, e.g., +15551234567)
- Verify your Twilio account has permissions to call the destination number
- Check the server logs for specific Twilio errors
- Ensure your application can reach the Twilio API (no network/firewall restrictions)

## Call Flow
1. When you initiate a call, the server sends a request to Twilio to make an outbound call
2. When the expert answers the call, Twilio requests instructions from your server
3. The server responds with TwiML instructions for what the call should say/do
4. As the call progresses, Twilio sends status updates to your server
5. The application updates the call status in real-time
6. After the call, a summary and transcript will be available in the Call Details page

## Next Steps
After setting up the call feature, consider enhancing your experience by:
- Customizing the TwiML script for different types of calls
- Integrating speech-to-text to generate real transcripts
- Setting up webhooks for more advanced call monitoring
- Adding call recording functionality for review purposes 