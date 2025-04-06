import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

// Import our Twilio service
import { initiateCall, getCallStatus } from './services/twilio.service';

// Initialize environment variables
dotenv.config();

// Get the port from the environment variable
const PORT = process.env.PORT || 5000;

// Create Express application
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000', `http://localhost:${PORT}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.send('ExpertAssist AI API is running');
});

// Route to initiate a call
app.post('/api/calls', async (req, res) => {
  try {
    const { phoneNumber, goal } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // The callback URL that Twilio will call when the call is answered
    const callbackUrl = `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/calls/twiml`;
    
    // Store call goal in a database or session in a real app
    // For now, we'll just log it
    console.log(`Call goal: ${goal}`);

    try {
      // Initiate the call
      const callInfo = await initiateCall(phoneNumber, callbackUrl);
      
      res.status(200).json({
        success: true,
        message: 'Call initiated successfully',
        data: callInfo
      });
    } catch (callError: any) {
      // Check if this is a Twilio authentication error but we're in demo mode
      if (process.env.DEMO_MODE === 'true') {
        console.log('Using demo mode due to Twilio error:', callError.message);
        
        // Return a simulated response
        res.status(200).json({
          success: true,
          message: 'Call initiated in demo mode',
          data: {
            callSid: `demo-call-${Date.now()}`,
            status: 'queued',
            dateCreated: new Date().toISOString(),
          }
        });
      } else {
        // If not in demo mode, return the error
        throw callError;
      }
    }
  } catch (error: any) {
    console.error('Call initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate call',
    });
  }
});

// TwiML endpoint that Twilio will call when the call is answered
app.post('/api/calls/twiml', (req, res) => {
  const twiml = new VoiceResponse();
  
  // Say a message when the call is answered
  twiml.say(
    { voice: 'Polly.Matthew', language: 'en-US' },
    'Hello! This is an automated call from Expert Assist A.I. I am calling to gather some information. Please stay on the line.'
  );

  // Add a pause
  twiml.pause({ length: 1 });
  
  // Add more TwiML to create an interactive voice experience
  twiml.say(
    { voice: 'Polly.Matthew', language: 'en-US' },
    'I will now ask you some questions. Please respond clearly.'
  );

  // Send the TwiML response
  res.type('text/xml');
  res.send(twiml.toString());
});

// Route to get call status
app.get('/api/calls/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    
    // Handle demo mode
    if (callSid.startsWith('demo-call-')) {
      const statuses = ['queued', 'ringing', 'in-progress', 'completed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return res.status(200).json({
        success: true,
        data: {
          callSid: callSid,
          status: randomStatus,
          duration: '120',
          direction: 'outbound-api',
          from: process.env.TWILIO_PHONE_NUMBER || '+15551234567',
          to: '+15559876543',
          startTime: new Date(Date.now() - 120000).toISOString(),
          endTime: randomStatus === 'completed' ? new Date().toISOString() : null,
        }
      });
    }
    
    const callStatus = await getCallStatus(callSid);
    
    res.status(200).json({
      success: true,
      data: callStatus
    });
  } catch (error: any) {
    console.error('Error fetching call status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch call status',
    });
  }
});

// Call status webhook
app.post('/api/calls/twiml/status', (req, res) => {
  console.log('Call status update:', req.body);
  
  // In a real app, you'd update the call status in your database
  // For now, we'll just acknowledge the webhook
  res.sendStatus(200);
});

// Add an endpoint to check if we're in demo mode
app.get('/api/config/demo-status', (req, res) => {
  res.json({
    demoMode: process.env.DEMO_MODE === 'true',
    twilioConfigured: !!process.env.TWILIO_ACCOUNT_SID && 
                     !!process.env.TWILIO_AUTH_TOKEN && 
                     !!process.env.TWILIO_PHONE_NUMBER,
    validAccountSid: process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') || false,
    phoneNumberFormatted: process.env.TWILIO_PHONE_NUMBER
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 