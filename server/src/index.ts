import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as twilio from 'twilio';

// Initialize environment variables
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with improved options
app.use(cors({
  origin: '*', // Allow requests from any origin in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Add a special handler for CORS preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.status(200).json({});
  }
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Twilio service
const VoiceResponse = twilio.twiml.VoiceResponse;
import { initiateCall, getCallStatus } from './services/twilio.service';

// Welcome route
app.get('/', (req, res) => {
  res.send('ExpertAssist AI API is running');
});

// Config endpoint to check demo mode
app.get('/api/config/demo-status', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  const twilioConfigured = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
  console.log("process.env.TWILIO_ACCOUNT_SID = ", process.env.TWILIO_ACCOUNT_SID);
  res.json({
    demoMode: process.env.DEMO_MODE === 'true',
    twilioConfigured,
    validAccountSid: process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') || false,
    serverPort: process.env.CURRENT_PORT || process.env.PORT || '5000'
  });
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

// Add route to get call status
app.get('/api/calls/status/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    
    // If in demo mode, return a mock call status
    if (process.env.DEMO_MODE === 'true') {
      const statuses = ['queued', 'ringing', 'in-progress', 'completed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      console.log(`[DEMO MODE] Getting status for call ${callSid}: ${randomStatus}`);
      
      return res.json({
        callSid: callSid,
        status: randomStatus,
        duration: '120',
        direction: 'outbound-api',
        from: process.env.TWILIO_PHONE_NUMBER || '+15551234567',
        to: '+15559876543',
        startTime: new Date(Date.now() - 120000).toISOString(),
        endTime: randomStatus === 'completed' ? new Date().toISOString() : null,
      });
    }
    
    // Check if Twilio is properly configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'Twilio is not configured properly. Check your environment variables.'
      });
    }
    
    // Get the Twilio client
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Get the call status from Twilio
    const call = await twilio.calls(callSid).fetch();
    
    // Return the call status
    res.json({
      callSid: call.sid,
      status: call.status,
      duration: call.duration,
      direction: call.direction,
      from: call.from,
      to: call.to,
      startTime: call.startTime,
      endTime: call.endTime,
    });
  } catch (error: any) {
    console.error('Error fetching call status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch call status',
    });
  }
});

// Route to initiate a call
app.post('/api/calls/initiate', async (req, res) => {
  try {
    const { expertPhoneNumber, expertId, expertName, goal } = req.body;
    
    if (!expertPhoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // The callback URL that Twilio will call when the call is answered
    let callbackUrl = `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/calls/twiml`;
    
    // Make sure the URL is properly formatted
    if (!callbackUrl.startsWith('http')) {
      callbackUrl = `http://${callbackUrl}`;
    }
    
    console.log(`Call goal: ${goal}, Expert: ${expertName}, Phone: ${expertPhoneNumber}`);
    console.log(`Using callback URL: ${callbackUrl}`);

    try {
      // Initiate the call
      const callInfo = await initiateCall(expertPhoneNumber, callbackUrl);
      
      res.status(200).json({
        success: true,
        callSid: callInfo.callSid,
        status: callInfo.status,
        message: 'Call initiated successfully'
      });
    } catch (callError: any) {
      // Check if this is a Twilio authentication error but we're in demo mode
      if (process.env.DEMO_MODE === 'true') {
        console.log('Using demo mode due to Twilio error:', callError.message);
        
        // Store expert info in session storage (for demo mode)
        const demoCallSid = `demo-call-${Date.now()}`;
        
        // Return a simulated response
        res.status(200).json({
          success: true,
          callSid: demoCallSid,
          status: 'initiated',
          message: 'Demo call initiated successfully'
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

// Add route to end a call
app.post('/api/calls/:callSid/end', async (req, res) => {
  try {
    const { callSid } = req.params;
    
    // If in demo mode, just return success
    if (process.env.DEMO_MODE === 'true') {
      console.log(`[DEMO MODE] Ending call ${callSid}`);
      
      return res.json({
        success: true,
        callSid: callSid,
        status: 'completed',
        message: 'Call ended successfully in demo mode'
      });
    }
    
    // Check if Twilio is properly configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'Twilio is not configured properly. Check your environment variables.'
      });
    }
    
    // Get the Twilio client
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // End the call with Twilio
    const call = await twilio.calls(callSid).update({
      status: 'completed'
    });
    
    res.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      message: 'Call ended successfully'
    });
  } catch (error: any) {
    console.error('Error ending call:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to end call',
    });
  }
});

// Set MongoDB connection options
const mongoOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
  connectTimeoutMS: 10000, // 10 second timeout for initial connection
};

// Handle MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expertassist';
    
    // Skip MongoDB connection in demo mode if requested
    if (process.env.DEMO_MODE === 'true' && process.env.SKIP_MONGO === 'true') {
      console.log('Skipping MongoDB connection (demo mode with SKIP_MONGO=true)');
      return;
    }
    
    // Check if we have a MongoDB URI
    if (!mongoURI) {
      console.log('MongoDB URI not found in environment variables, skipping database connection');
      return;
    }
    
    // Set a short timeout for MongoDB connection (fail fast in demo mode)
    const connectTimeoutMS = process.env.DEMO_MODE === 'true' ? 2000 : 10000;
    
    // Connect to MongoDB with shorter timeout in demo mode
    await mongoose.connect(mongoURI, {
      ...mongoOptions,
      connectTimeoutMS,
      serverSelectionTimeoutMS: connectTimeoutMS
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continue without database connection (demo mode)');
  }
};

// Function to start the server
const startServer = async () => {
  try {
    // Try to connect to MongoDB (but continue even if it fails)
    await connectDB();
    
    // Define the ports
    const primaryPort = parseInt(process.env.PORT || '5000', 10);
    const fallbackPort = 5001;
    let currentPort = primaryPort;
    
    // Create the HTTP server but don't start listening yet
    const server = app.listen(currentPort);
    
    // Handle port in use error
    server.on('error', (error: any) => {
      if (error.code !== 'EADDRINUSE') {
        console.error('Server error:', error);
        process.exit(1);
      }
      
      console.log(`Port ${currentPort} is already in use, trying ${fallbackPort} instead`);
      
      // Try the fallback port
      currentPort = fallbackPort;
      server.close();
      
      // Wait a moment before trying the new port
      setTimeout(() => {
        server.listen(currentPort);
      }, 1000);
    });
    
    // Handle when server successfully starts
    server.on('listening', () => {
      const apiUrl = `http://localhost:${currentPort}`;
      process.env.API_BASE_URL = apiUrl;
      process.env.CURRENT_PORT = currentPort.toString();
      
      console.log(`Server running on port ${currentPort}`);
      console.log(`API base URL: ${apiUrl}`);
      console.log(`Demo mode: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
    });
    
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise rejection:', err);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process, just log the error
}); 