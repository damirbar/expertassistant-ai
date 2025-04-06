import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CallStatus } from './CallsList';
import CallService from '../../services/CallService';

interface Call {
  _id: string;
  goal: string;
  expertId: string;
  expertName: string;
  expertPhoneNumber: string;
  status: CallStatus;
  createdAt: string;
  completedAt?: string;
  durationSeconds?: number;
  summary?: string;
  transcript?: string;
  notes?: string;
}

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
`;

const PrimaryButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #dfe6e9;

  &:hover {
    background-color: #e9ecef;
  }
`;

const DangerButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.h2`
  color: #7f8c8d;
  font-size: 1.25rem;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 2rem;
`;

const CallCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CallHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CallInfo = styled.div`
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #7f8c8d;
  width: 200px;
`;

const InfoValue = styled.span`
  color: #2c3e50;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case CallStatus.COMPLETED:
        return 'background-color: #e8f5e9; color: #388e3c;';
      case CallStatus.FAILED:
        return 'background-color: #ffebee; color: #d32f2f;';
      case CallStatus.PENDING:
      case CallStatus.DIALING:
        return 'background-color: #fff8e1; color: #ffa000;';
      case CallStatus.CONNECTED:
      case CallStatus.IN_PROGRESS:
        return 'background-color: #e3f2fd; color: #1976d2;';
      case CallStatus.SUMMARIZING:
        return 'background-color: #f3e5f5; color: #7b1fa2;';
      case CallStatus.NEEDS_FOLLOWUP:
        return 'background-color: #fbe9e7; color: #e64a19;';
      default:
        return 'background-color: #eceff1; color: #546e7a;';
    }
  }}
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.5rem;
`;

const ContentSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CallSummary = styled.div`
  line-height: 1.6;
  font-size: 1.1rem;
  color: #2c3e50;
  white-space: pre-line;
`;

const CallTranscript = styled.div`
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  white-space: pre-line;
  max-height: 400px;
  overflow-y: auto;
`;

const NotesContainer = styled.div`
  margin-top: 1rem;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
`;

const CallDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [retryingCall, setRetryingCall] = useState(false);
  const [endingCall, setEndingCall] = useState(false);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setLoading(true);
        
        // If it looks like a demo call SID, get status from our service
        if (id && id.startsWith('demo-call-')) {
          try {
            const callInfo = await CallService.getCallStatus(id);
            console.log('Demo call info:', callInfo);
            
            // With the updated service, we should already have all the data we need
            setCall(callInfo);
            setNotes(callInfo.notes || '');
            setLoading(false);
            return;
          } catch (err) {
            console.error('Error fetching demo call:', err);
            setError('Failed to load call details. Please try again.');
            setLoading(false);
            return;
          }
        }
        // Try to get the real call status from Twilio
        else if (id && id.length > 8 && !id.startsWith('demo-call-')) {  
          try {
            const callInfo = await CallService.getCallStatus(id);
            
            // Create a call object with the Twilio call info
            const twilioCall: Call = {
              _id: id,
              goal: 'Phone call via Twilio',  // We don't have this from Twilio
              expertId: '101',  // Placeholder
              expertName: 'External Call',  // We don't have this from Twilio
              expertPhoneNumber: callInfo.to || 'Unknown',
              status: callInfo.status === 'completed' ? CallStatus.COMPLETED : 
                      callInfo.status === 'in-progress' ? CallStatus.IN_PROGRESS :
                      callInfo.status === 'ringing' ? CallStatus.DIALING :
                      callInfo.status === 'failed' ? CallStatus.FAILED :
                      CallStatus.PENDING,
              createdAt: new Date().toISOString(),
              completedAt: callInfo.endTime,
              durationSeconds: parseInt(callInfo.duration) || 0,
            };
            
            setCall(twilioCall);
            setLoading(false);
            return;
          } catch (err) {
            console.error('Error fetching Twilio call:', err);
            // Fall back to mock data if Twilio call fetch fails
          }
        } 
        // Otherwise use mock data
        else {
          // If we can't get real call data, use the mock data
          // In a real app, this would be a call to the actual API
          setTimeout(() => {
            const mockCall: Call = {
              _id: id || '1',
              goal: 'Check mortgage approval status',
              expertId: '101',
              expertName: 'John Doe (Lender)',
              expertPhoneNumber: '(555) 123-4567',
              status: CallStatus.COMPLETED,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 mins later
              durationSeconds: 352,
              summary: 'The client has been pre-approved for a mortgage of $450,000 with an interest rate of 3.75%, locked in for 60 days. The lender confirmed that all required documentation has been received and processed. The pre-approval letter will be emailed by the end of the day. The client is advised to avoid any major financial changes until closing.',
              transcript: `AI Assistant: Hello, I'm calling on behalf of Jane Smith from City Real Estate. I'm trying to check on a mortgage pre-approval status for client Michael Johnson. Is this John Doe from ABC Mortgage?

Lender: Yes, this is John from ABC Mortgage. How can I help?

AI Assistant: Great, thanks for confirming. I'm checking on the pre-approval status for Michael Johnson who applied last week. Do you have any updates on that application?

Lender: Let me check our system. Michael Johnson... yes, I see the application here. Good news - he's been pre-approved for $450,000.

AI Assistant: That's excellent. Can you tell me what interest rate he's been approved for?

Lender: He's been approved at 3.75%, and we can lock that rate in for 60 days.

AI Assistant: Perfect. Has all the necessary documentation been received or is there anything else needed from the client?

Lender: No, we have everything we need. All documentation has been received and processed.

AI Assistant: When can we expect to receive the pre-approval letter?

Lender: I'll email that by the end of today.

AI Assistant: Great. Any advice or recommendations for the client while they're shopping for homes?

Lender: Just advise them to avoid any major financial changes until closing - no new credit cards, large purchases, or job changes.

AI Assistant: Understood. Is there anything else important I should relay to the client?

Lender: No, that covers everything. They're in good shape for their home search with that $450,000 pre-approval.

AI Assistant: Thank you for your time and information. Have a great day!

Lender: You too, goodbye.`,
              notes: 'Follow up with client to inform about the approval. Make sure they receive the pre-approval letter.',
            };
            
            setCall(mockCall);
            setNotes(mockCall.notes || '');
            setLoading(false);
          }, 1000);
        }
        
      } catch (err: any) {
        setError(err.message || 'Error fetching call details');
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the call on the server
      // await axios.patch(`/api/calls/${id}`, { notes });
      
      // Update local state
      if (call) {
        setCall({
          ...call,
          notes: notes
        });
      }
      
      setSavingNotes(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving notes');
      setSavingNotes(false);
    }
  };

  const handleRetryCall = async () => {
    try {
      setRetryingCall(true);
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would initiate a new call with the same expert and goal
      // await axios.post('/api/calls/retry', { callId: id });
      
      // For now, we'll just update the status to pending
      if (call) {
        setCall({
          ...call,
          status: CallStatus.PENDING
        });
      }
      
      setRetryingCall(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error retrying call');
      setRetryingCall(false);
    }
  };

  const handleEndCall = async () => {
    if (!call || !id) return;
    
    try {
      setEndingCall(true);
      
      // Call the service to end the call
      const result = await CallService.endCall(id);
      console.log('Call ended:', result);
      
      // Update the call status in the UI
      setCall({
        ...call,
        status: CallStatus.COMPLETED,
        completedAt: new Date().toISOString()
      });
      
      setEndingCall(false);
    } catch (err: any) {
      setError(err.message || 'Error ending call');
      setEndingCall(false);
    }
  };

  if (loading) {
    return <LoadingState>Loading call details...</LoadingState>;
  }

  if (error) {
    return (
      <Container>
        <BackLink to="/calls">&larr; Back to Calls</BackLink>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  if (!call) {
    return (
      <Container>
        <BackLink to="/calls">&larr; Back to Calls</BackLink>
        <ErrorMessage>Call not found</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackLink to="/calls">&larr; Back to Calls</BackLink>
        
        <ButtonGroup>
          {(call.status === CallStatus.IN_PROGRESS || 
            call.status === CallStatus.CONNECTED || 
            call.status === CallStatus.DIALING) && (
            <DangerButton onClick={handleEndCall} disabled={endingCall}>
              {endingCall ? 'Ending Call...' : 'End Call'}
            </DangerButton>
          )}
          {(call.status === CallStatus.FAILED) && (
            <PrimaryButton onClick={handleRetryCall} disabled={retryingCall}>
              {retryingCall ? 'Retrying...' : 'Retry Call'}
            </PrimaryButton>
          )}
          <SecondaryButton onClick={() => navigate(`/experts/${call.expertId}`)}>
            View Expert
          </SecondaryButton>
        </ButtonGroup>
      </Header>

      <Title>{call.goal}</Title>
      <SubTitle>Call with {call.expertName}</SubTitle>

      <CallCard>
        <CallHeader>
          <CallInfo>
            <InfoRow>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue>
                <StatusBadge status={call.status}>
                  {formatStatus(call.status)}
                </StatusBadge>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Expert:</InfoLabel>
              <InfoValue>{call.expertName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Phone Number:</InfoLabel>
              <InfoValue>{call.expertPhoneNumber}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Started:</InfoLabel>
              <InfoValue>{formatDate(call.createdAt)}</InfoValue>
            </InfoRow>
            {call.completedAt && (
              <InfoRow>
                <InfoLabel>Completed:</InfoLabel>
                <InfoValue>{formatDate(call.completedAt)}</InfoValue>
              </InfoRow>
            )}
            {call.durationSeconds && (
              <InfoRow>
                <InfoLabel>Duration:</InfoLabel>
                <InfoValue>{formatDuration(call.durationSeconds)}</InfoValue>
              </InfoRow>
            )}
          </CallInfo>
        </CallHeader>
      </CallCard>

      {call.summary && (
        <ContentSection>
          <SectionTitle>Call Summary</SectionTitle>
          <CallSummary>{call.summary}</CallSummary>
        </ContentSection>
      )}

      {call.transcript && (
        <ContentSection>
          <SectionTitle>Call Transcript</SectionTitle>
          <CallTranscript>{call.transcript}</CallTranscript>
        </ContentSection>
      )}

      <ContentSection>
        <SectionTitle>Notes</SectionTitle>
        <NotesContainer>
          <NotesTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this call..."
          />
          <PrimaryButton
            onClick={handleSaveNotes}
            disabled={savingNotes}
          >
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </PrimaryButton>
        </NotesContainer>
      </ContentSection>
    </Container>
  );
};

export default CallDetails; 