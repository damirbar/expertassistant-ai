import { Twilio } from 'twilio';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import Call, { CallStatus, ICall } from '../models/call.model';
import Expert, { IExpert } from '../models/expert.model';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the port from the environment variable
const PORT = process.env.PORT || 5000;

// Check if we're in demo mode
const isDemo = process.env.DEMO_MODE === 'true';

// Initialize Twilio client (only if not in demo mode)
let twilioClient: Twilio | null = null;
if (!isDemo && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    // Verify the account SID has the correct format (must start with AC)
    const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
    if (!accountSid.startsWith('AC')) {
      console.error('Invalid Twilio Account SID format. Must start with "AC"');
      console.log('Call service: Running in DEMO mode due to invalid credentials');
    } else {
      twilioClient = new Twilio(
        accountSid,
        process.env.TWILIO_AUTH_TOKEN as string
      );
      console.log('Call service: Twilio client initialized with real credentials');
    }
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    console.log('Call service: Running in DEMO mode due to initialization error');
  }
} else {
  console.log('Call service: Running in DEMO mode - no real calls will be made');
}

// Initialize OpenAI client (if credentials are available)
let openaiClient: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });
  console.log('Call service: OpenAI client initialized');
} else {
  console.log('Call service: OpenAI API key not provided - using placeholder responses');
}

/**
 * Start the call service process
 * This is the main function that orchestrates the entire call process
 */
export const startCallService = async (callId: string): Promise<void> => {
  try {
    // Find call and related data
    const call = await Call.findById(callId) as ICall | null;
    if (!call) {
      throw new Error(`Call with ID ${callId} not found`);
    }

    // Update call status to dialing
    await updateCallStatus(callId, CallStatus.DIALING);

    // Get expert and user info
    const expert = await Expert.findById(call.expertId) as IExpert | null;
    const user = await User.findById(call.userId) as IUser | null;

    if (!expert || !user) {
      throw new Error('Expert or user not found');
    }

    // For now, this is a simplified placeholder for the actual call flow
    // In a real implementation, this would use Twilio to place the call
    // and handle the conversation flow
    await simulateCallFlow(call, expert, user);

  } catch (error: any) {
    console.error('Error in call service:', error);
    
    // Update call to failed status
    try {
      await Call.findByIdAndUpdate(callId, {
        status: CallStatus.FAILED,
        failureReason: error.message || 'Unknown error in call service',
      });
    } catch (updateError) {
      console.error('Error updating call status to failed:', updateError);
    }
  }
};

/**
 * Update call status
 */
const updateCallStatus = async (callId: string, status: CallStatus): Promise<ICall> => {
  const call = await Call.findByIdAndUpdate(
    callId,
    { status },
    { new: true }
  ) as ICall | null;

  if (!call) {
    throw new Error(`Call with ID ${callId} not found when updating status`);
  }

  return call;
};

/**
 * Simulate call flow (placeholder for actual implementation)
 * This is a simplified simulation - in a real app, this would interface with
 * Twilio's API to place actual calls and handle the conversation
 */
const simulateCallFlow = async (call: ICall, expert: IExpert, user: IUser): Promise<void> => {
  try {
    const callId = call._id.toString();
    
    // Update status to connected (in a real scenario, this would happen after Twilio connects)
    await updateCallStatus(callId, CallStatus.CONNECTED);
    
    // Wait a bit to simulate connection time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status to in progress
    await updateCallStatus(callId, CallStatus.IN_PROGRESS);
    
    // Simulate conversation duration
    await new Promise(resolve => setTimeout(resolve, 6000)); // 6 seconds
    
    // Generate a placeholder transcript
    const transcript = await generatePlaceholderTranscript(call, expert, user);
    
    // Update status to summarizing
    await updateCallStatus(callId, CallStatus.SUMMARIZING);
    
    // Generate a summary
    const summary = await generateSummary(transcript, call.goal);
    
    // Save transcript and summary
    await Call.findByIdAndUpdate(callId, {
      transcript,
      summary,
      status: CallStatus.COMPLETED,
      durationSeconds: 120, // Placeholder duration
      completedAt: new Date()
    });
    
  } catch (error: any) {
    console.error('Error in call flow simulation:', error);
    throw error;
  }
};

/**
 * Generate a placeholder transcript (for demonstration)
 * In a real app, this would be created from actual call audio using STT
 */
const generatePlaceholderTranscript = async (
  call: ICall,
  expert: IExpert,
  user: IUser
): Promise<string> => {
  const userFullName = `${user.firstName} ${user.lastName}`;

  // In a real implementation, this would come from the actual call recording and transcription
  return `
[AI Assistant]: Hi, this is an AI assistant calling from ExpertAssist AI on behalf of ${userFullName} regarding ${call.goal}. Is now a good time?

[${expert.name}]: Yes, I have a few minutes. What can I help with?

[AI Assistant]: Great, thank you. ${userFullName} wanted me to ask you about ${call.goal}. ${call.contextText ? 'They provided the following context: ' + call.contextText : ''}

[${expert.name}]: I see. Well, regarding ${call.goal}, I can tell you that we typically handle this by following these steps...

[AI Assistant]: That's helpful information. Could you also let me know about the timeline for this process?

[${expert.name}]: Certainly. The timeline usually depends on several factors, but in general...

[AI Assistant]: Thank you for that explanation. Is there anything else ${userFullName} should know or prepare regarding this matter?

[${expert.name}]: Yes, they should make sure to have these documents ready...

[AI Assistant]: I've made note of all that information. Is there a best time for ${userFullName} to reach out if they have follow-up questions?

[${expert.name}]: They can call me anytime during business hours, or email is sometimes better for detailed questions.

[AI Assistant]: Great, I'll pass that along. Thank you so much for your time today. I'll make sure ${userFullName} gets all this information.

[${expert.name}]: You're welcome. Goodbye.

[AI Assistant]: Goodbye.
`;
};

/**
 * Generate a summary from the transcript
 * In a real app, this would use a more sophisticated AI approach 
 */
const generateSummary = async (transcript: string, goal: string): Promise<string> => {
  try {
    // In a real implementation, we would use the OpenAI API to generate 
    // a concise, structured summary based on the actual transcript
    
    // This is a placeholder for demonstration
    return `
Summary of Call Regarding: ${goal}

Key Information Gathered:
- The expert explained the standard process for handling this request
- Timeline depends on several factors, but generally takes [X] time
- You should prepare the following documents: [Document List]

Action Items:
- Prepare required documents
- Follow up with the expert via email for detailed questions
- Next steps should be taken within [timeframe]

The expert is available during regular business hours for follow-up questions, with email preferred for detailed inquiries.
`;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Error generating summary. Please refer to the transcript for details.';
  }
}; 