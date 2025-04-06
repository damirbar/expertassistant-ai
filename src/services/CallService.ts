import axios from 'axios';

class CallService {
  private apiUrl: string = 'http://localhost:5001';
  private serverConfig: {
    demoMode: boolean;
    twilioConfigured: boolean;
    validAccountSid: boolean;
    serverPort: string;
  } | null = null;
  
  constructor() {
    // Check connection on init
    this.getServerConfig().catch(err => 
      console.warn('Could not connect to server initially:', err)
    );
  }
  
  async getServerConfig(): Promise<any> {
    if (this.serverConfig) {
      return this.serverConfig;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/api/config/demo-status`);
      if (!response.ok) {
        throw new Error('Failed to fetch server config');
      }
      
      this.serverConfig = await response.json();
      console.log('Server config:', this.serverConfig);
      return this.serverConfig;
    } catch (error) {
      console.error('Error fetching server config:', error);
      // Return a default config when unable to connect
      return {
        demoMode: true,
        twilioConfigured: false,
        validAccountSid: false,
        serverPort: '5001'
      };
    }
  }
  
  async getApiUrl(): Promise<string> {
    return this.apiUrl;
  }
  
  async checkDemoMode(): Promise<boolean> {
    const config = await this.getServerConfig();
    return config.demoMode;
  }
  
  async checkTwilioConfigured(): Promise<boolean> {
    const config = await this.getServerConfig();
    return config.twilioConfigured && config.validAccountSid;
  }
  
  async initiateCall(
    expertPhoneNumber: string, 
    expertId: string = '', 
    expertName: string = '', 
    goal: string = ''
  ): Promise<any> {
    try {
      const isDemoMode = await this.checkDemoMode();
      const isTwilioConfigured = await this.checkTwilioConfigured();
      
      // Store these in sessionStorage for demo mode
      sessionStorage.setItem('demoExpertName', expertName || 'Unknown Expert');
      sessionStorage.setItem('demoExpertId', expertId || '101');
      sessionStorage.setItem('demoGoal', goal || 'Demo call');
      sessionStorage.setItem('demoPhone', expertPhoneNumber);
      
      console.log("Phone number being called:", expertPhoneNumber);
      
      if (isDemoMode || !isTwilioConfigured) {
        console.log('Using demo mode for call');
        console.log(`Expert name: ${expertName}, ID: ${expertId}, Goal: ${goal}`);
        
        // In demo mode, simulate a successful call response
        return {
          success: true,
          callSid: `demo-call-${Date.now()}`,
          status: 'initiated',
          message: 'Demo call initiated successfully'
        };
      }
      
      // Make the real API call to initiate the call
      const response = await fetch(`${this.apiUrl}/api/calls/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          expertPhoneNumber,
          expertId,
          expertName,
          goal
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate call');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  }
  
  async endCall(callSid: string): Promise<any> {
    try {
      // For demo calls, just return a success response
      if (callSid.startsWith('demo-call-')) {
        console.log('Ending demo call:', callSid);
        return {
          success: true,
          callSid,
          status: 'completed',
          message: 'Demo call ended successfully'
        };
      }
      
      // For real calls, make an API request
      const response = await fetch(`${this.apiUrl}/api/calls/${callSid}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to end call');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }
  
  async getCallStatus(callSid: string): Promise<any> {
    try {
      // Check if this is a demo call
      if (callSid.startsWith('demo-call-')) {
        console.log('Retrieving demo call status');
        
        // Generate a random status that matches the CallStatus enum
        const possibleStatuses = [
          'pending', 'dialing', 'connected', 
          'in_progress', 'completed'
        ];
        const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
        
        // Retrieve stored expert data
        const expertName = sessionStorage.getItem('demoExpertName') || 'Unknown Expert';
        const expertId = sessionStorage.getItem('demoExpertId') || '101';
        const goal = sessionStorage.getItem('demoGoal') || 'Demo call';
        const expertPhoneNumber = sessionStorage.getItem('demoPhone') || '+15551234567';
        
        // Generate demo data based on status
        let summary = '';
        let transcript = '';
        let notes = '';
        
        if (randomStatus === 'completed') {
          summary = `The call with ${expertName} was successfully completed. The expert confirmed availability and provided the requested information.`;
          
          transcript = `AI Assistant: Hello, this is an automated call from ExpertAssist AI. I'm calling regarding ${goal}. Am I speaking with ${expertName}?

Expert: Yes, this is ${expertName}. How can I help you?

AI Assistant: Great. I'm calling to gather some information about ${goal}. Do you have a few minutes to talk?

Expert: Yes, I can talk now. What information do you need?

AI Assistant: Thank you. I appreciate your time. I'd like to discuss the details of ${goal}.

Expert: I understand. Let me provide you with the information you need.

AI Assistant: Thank you. That's very helpful. Is there anything else I should know about ${goal}?

Expert: No, I think we've covered everything important for now.

AI Assistant: Perfect. Thank you for your time today. I'll relay this information back to the client.

Expert: You're welcome. Have a great day.

AI Assistant: You too. Goodbye.`;
          
          notes = `Follow up with ${expertName} next week to confirm details discussed during the call.`;
        }
        
        // Simulate call status for demo mode with proper fields
        return {
          _id: callSid,
          callSid: callSid,
          status: randomStatus,
          duration: '83',
          direction: 'outbound-api',
          from: '+1234567890',
          to: expertPhoneNumber,
          expertName: expertName,
          expertId: expertId,
          expertPhoneNumber: expertPhoneNumber,
          goal: goal,
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
          completedAt: randomStatus === 'completed' ? new Date().toISOString() : null,
          durationSeconds: 83,
          summary: summary,
          transcript: transcript,
          notes: notes
        };
      }
      
      // Make the real API call to get call status
      const response = await fetch(`${this.apiUrl}/api/calls/status/${callSid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get call status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting call status:', error);
      throw new Error('Cannot connect to the server. Please try again later.');
    }
  }
}

// Create a single instance to export
const callServiceInstance = new CallService();
export default callServiceInstance; 