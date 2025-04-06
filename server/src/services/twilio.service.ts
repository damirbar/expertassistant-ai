import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Check if we're in demo mode
const isDemo = process.env.DEMO_MODE === 'true';

// Initialize Twilio client with your credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Format phone number to E.164 format (removing all non-numeric characters and adding +1)
const formatPhoneNumber = (phoneNumber: string): string => {
  // If already in E.164 format, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // For this specific number (the one we've verified), use the exact format from Twilio dashboard
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly === '9014570987') {
    console.log('Using exact format for verified number');
    return '+1 901 457 0987';  // Exact format with spaces as shown in Twilio dashboard
  }
  
  // Remove all non-digit characters
  // If it has 10 digits (US number without country code)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  // If it already has country code (11 digits for US)
  else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  
  // Default: assume US and add +1
  return `+1${digitsOnly}`;
};

// Check if Twilio credentials are valid for real calls
const hasValidTwilioCredentials = !!(
  accountSid && 
  authToken && 
  twilioPhoneNumber && 
  accountSid.startsWith('AC')
);

// Initialize Twilio client if we have valid credentials and we're not in demo mode
let client: twilio.Twilio | null = null;

if (hasValidTwilioCredentials && !isDemo) {
  try {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized with real credentials');
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    console.log('Falling back to demo mode due to Twilio initialization error');
  }
} else {
  // Clear reason for using demo mode
  const reason = isDemo 
    ? 'DEMO_MODE is enabled' 
    : !accountSid || !authToken || !twilioPhoneNumber
      ? 'Missing Twilio credentials'
      : !accountSid.startsWith('AC')
        ? 'Invalid Account SID format (must start with AC)'
        : 'Unknown configuration issue';
        
  console.log(`Twilio client running in DEMO mode - ${reason}`);
}

/**
 * Initiates a call between the system and an expert
 * @param expertPhoneNumber - The phone number to call
 * @param callbackUrl - The URL Twilio will call when the call is answered
 * @returns Promise with call information
 */
export const initiateCall = async (
  expertPhoneNumber: string,
  callbackUrl: string
): Promise<any> => {
  // Format the phone number consistently (even in demo mode)
  const formattedNumber = formatPhoneNumber(expertPhoneNumber);

  // Check if we should use demo mode
  const useDemo = isDemo || !hasValidTwilioCredentials || !client;
  
  // If in demo mode, return a mock call object
  if (useDemo) {
    console.log(`[DEMO MODE] Would have called ${formattedNumber} with callback URL ${callbackUrl}`);
    return {
      callSid: `demo-call-${Date.now()}`,
      status: 'queued',
      dateCreated: new Date().toISOString(),
      to: formattedNumber,
      from: twilioPhoneNumber || '+15551234567'
    };
  }

  try {
    // Format the callback URL properly for Twilio
    // Twilio requires a publicly accessible URL, but for development we'll use a workaround
    // For production, you'd use a real domain or a service like ngrok
    let validCallbackUrl = callbackUrl;
    
    // For development, we can use a dummy URL that Twilio will accept
    // In real production, you'd use a proper webhook URL
    if (callbackUrl.includes('localhost')) {
      console.log('WARNING: Using localhost for Twilio webhook. This will not work in production.');
      // Use a URL that Twilio will accept for demonstration purposes
      validCallbackUrl = 'https://demo.twilio.com/welcome/voice/';
    }
    
    console.log(`Making Twilio call to ${formattedNumber} with callback URL: ${validCallbackUrl}`);
    console.log('Client exists:', !!client);
    console.log('Using Twilio account:', accountSid?.substring(0, 10) + '...');
    
    // Make the real call with Twilio
    const call = await client!.calls.create({
      to: formattedNumber,
      from: twilioPhoneNumber,
      url: validCallbackUrl, // This URL will be called when the recipient answers
      statusCallback: `${validCallbackUrl}/status`, // This URL will be called when call status changes
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      record: true,
    });

    return {
      callSid: call.sid,
      status: call.status,
      dateCreated: call.dateCreated,
      to: call.to,
      from: call.from
    };
  } catch (error) {
    console.error('Twilio call initiation error:', error);
    throw error;
  }
};

/**
 * Get the current status of a call
 * @param callSid - The Twilio call SID
 * @returns Promise with call information
 */
export const getCallStatus = async (callSid: string): Promise<any> => {
  // Check if we should use demo mode or this is a demo call
  const useDemo = isDemo || !hasValidTwilioCredentials || !client || callSid.startsWith('demo-call-');
  
  // If in demo mode or handling a demo call, return a mock call status
  if (useDemo) {
    const statuses = ['queued', 'ringing', 'in-progress', 'completed'];
    
    // Make the status progression more predictable based on time since creation
    const callIdParts = callSid.split('demo-call-');
    const timeStamp = callIdParts.length > 1 ? parseInt(callIdParts[1]) : Date.now();
    const timeSinceCreation = Date.now() - timeStamp;
    
    let statusIndex = 0;
    if (timeSinceCreation > 30000) statusIndex = 3; // completed after 30 seconds
    else if (timeSinceCreation > 15000) statusIndex = 2; // in-progress after 15 seconds
    else if (timeSinceCreation > 5000) statusIndex = 1; // ringing after 5 seconds
    
    const status = statuses[statusIndex];
    
    console.log(`[DEMO MODE] Getting status for call ${callSid}: ${status}`);
    
    return {
      callSid: callSid,
      status: status,
      duration: status === 'completed' ? Math.floor(timeSinceCreation / 1000).toString() : '0',
      direction: 'outbound-api',
      from: twilioPhoneNumber || '+15551234567',
      to: '+15559876543',
      startTime: new Date(timeStamp).toISOString(),
      endTime: status === 'completed' ? new Date().toISOString() : null,
    };
  }

  try {
    const call = await client!.calls(callSid).fetch();
    return {
      callSid: call.sid,
      status: call.status,
      duration: call.duration,
      direction: call.direction,
      from: call.from,
      to: call.to,
      startTime: call.startTime,
      endTime: call.endTime,
    };
  } catch (error) {
    console.error('Error fetching call status:', error);
    throw error;
  }
};

// Export the client for use in other services
export const getTwilioClient = (): twilio.Twilio | null => {
  return client;
}; 