import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ExpertType } from '../Experts/types';
import CallService from '../../services/CallService';

interface Expert {
  _id: string;
  name: string;
  phoneNumber: string;
  expertType: ExpertType;
  company?: string;
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

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin-top: 0;
  margin-bottom: 2rem;
`;

const FormContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background-color: white;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const ExpertInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #3498db;
`;

const ExpertInfoItem = styled.div`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExpertInfoLabel = styled.span`
  font-weight: 500;
  color: #7f8c8d;
  margin-right: 0.5rem;
`;

const ExpertTypeTag = styled.span<{ expertType: ExpertType }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({ expertType }) => {
    switch (expertType) {
      case ExpertType.REALTOR:
        return 'background-color: #e3f2fd; color: #1976d2;';
      case ExpertType.LENDER:
        return 'background-color: #e8f5e9; color: #388e3c;';
      case ExpertType.INSPECTOR:
        return 'background-color: #fff8e1; color: #ffa000;';
      case ExpertType.APPRAISER:
        return 'background-color: #f3e5f5; color: #7b1fa2;';
      case ExpertType.ATTORNEY:
        return 'background-color: #fbe9e7; color: #e64a19;';
      case ExpertType.INSURANCE_AGENT:
        return 'background-color: #e8eaf6; color: #3f51b5;';
      default:
        return 'background-color: #eceff1; color: #546e7a;';
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
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

const CancelButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #f8f9fa;
  color: #2c3e50;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const SubmitButton = styled(Button)`
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

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
`;

const StepsContainer = styled.div`
  margin-bottom: 2rem;
`;

const StepsList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Step = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#3498db' : 'transparent'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const EmptyStateText = styled.p`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const AddExpertButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const CallInitiate: React.FC = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<number>(1);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [goal, setGoal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [initiatingCall, setInitiatingCall] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch experts when component mounts
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a call to the actual API
        // For now, we'll simulate the API response
        setTimeout(() => {
          const mockExperts: Expert[] = [
            {
              _id: '101',
              name: 'John Doe',
              phoneNumber: '(901) 457-0987',
              expertType: ExpertType.REALTOR,
              company: 'ABC Realty',
            },
            {
              _id: '102',
              name: 'Jane Smith',
              phoneNumber: '(901) 457-0987',
              expertType: ExpertType.LENDER,
              company: 'XYZ Mortgage',
            },
            {
              _id: '103',
              name: 'Mike Johnson',
              phoneNumber: '(901) 457-0987',
              expertType: ExpertType.INSPECTOR,
              company: 'Quality Home Inspections',
            },
            {
              _id: '104',
              name: 'Sarah Williams',
              phoneNumber: '(901) 457-0987',
              expertType: ExpertType.ATTORNEY,
              company: 'Legal Solutions Inc.',
            },
            {
              _id: '105',
              name: 'Damir Bar',
              phoneNumber: '(901) 457-0987',
              expertType: ExpertType.OTHER,
              company: 'Damir Bar Inc.',
            },
          ];
          
          setExperts(mockExperts);
          setLoading(false);
        }, 1000);
        
        // Actual API call would look like this:
        // const response = await axios.get('/api/experts');
        // setExperts(response.data.data);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching experts');
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Update selected expert when expertId changes
  useEffect(() => {
    if (selectedExpertId) {
      const expert = experts.find(e => e._id === selectedExpertId) || null;
      setSelectedExpert(expert);
    } else {
      setSelectedExpert(null);
    }
  }, [selectedExpertId, experts]);

  const formatExpertType = (type: ExpertType): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleExpertSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExpertId(e.target.value);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGoal(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExpert) {
      setError('Please select an expert');
      return;
    }
    
    if (!goal.trim()) {
      setError('Please enter a goal for the call');
      return;
    }
    
    try {
      setInitiatingCall(true);
      setError(null);
      
      // Call the updated service with all expert info
      const callInfo = await CallService.initiateCall(
        selectedExpert.phoneNumber,
        selectedExpert._id,
        selectedExpert.name,
        goal
      );
      
      console.log('Call initiated:', callInfo);
      
      // Navigate to the call details page with the callSid
      navigate(`/calls/${callInfo?.callSid || 'demo-call-' + Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Error initiating call');
    } finally {
      setInitiatingCall(false);
    }
  };

  const renderExpertTypeTag = (expertType: ExpertType) => {
    return (
      <ExpertTypeTag expertType={expertType}>
        {formatExpertType(expertType)}
      </ExpertTypeTag>
    );
  };

  if (loading) {
    return <LoadingState>Loading experts...</LoadingState>;
  }

  return (
    <Container>
      <Header>
        <BackLink to="/calls">&larr; Back to Calls</BackLink>
      </Header>

      <Title>Initiate a New Call</Title>
      <Subtitle>Automate information gathering from your real estate experts</Subtitle>

      <StepsContainer>
        <StepsList>
          <Step active={step === 1}>1. Select Expert</Step>
          <Step active={step === 2}>2. Define Goal</Step>
          <Step active={step === 3}>3. Review & Initiate</Step>
        </StepsList>
      </StepsContainer>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <FormGroup>
                <Label htmlFor="expertId">Select an Expert to Call</Label>
                {experts.length === 0 ? (
                  <EmptyState>
                    <EmptyStateTitle>No experts found</EmptyStateTitle>
                    <EmptyStateText>
                      You need to add experts before you can make calls.
                    </EmptyStateText>
                    <AddExpertButton to="/experts/new">Add an Expert</AddExpertButton>
                  </EmptyState>
                ) : (
                  <>
                    <Select
                      id="expertId"
                      value={selectedExpertId}
                      onChange={handleExpertSelect}
                      required
                    >
                      <option value="">-- Select an Expert --</option>
                      {experts.map(expert => (
                        <option key={expert._id} value={expert._id}>
                          {expert.name} ({formatExpertType(expert.expertType)})
                        </option>
                      ))}
                    </Select>
                    
                    {selectedExpert && (
                      <ExpertInfo>
                        <ExpertInfoItem>
                          <ExpertInfoLabel>Name:</ExpertInfoLabel>
                          {selectedExpert.name}
                        </ExpertInfoItem>
                        <ExpertInfoItem>
                          <ExpertInfoLabel>Type:</ExpertInfoLabel>
                          {renderExpertTypeTag(selectedExpert.expertType)}
                        </ExpertInfoItem>
                        <ExpertInfoItem>
                          <ExpertInfoLabel>Phone:</ExpertInfoLabel>
                          {selectedExpert.phoneNumber}
                        </ExpertInfoItem>
                        {selectedExpert.company && (
                          <ExpertInfoItem>
                            <ExpertInfoLabel>Company:</ExpertInfoLabel>
                            {selectedExpert.company}
                          </ExpertInfoItem>
                        )}
                      </ExpertInfo>
                    )}
                  </>
                )}
              </FormGroup>

              <ButtonGroup>
                <CancelButton to="/calls">Cancel</CancelButton>
                <SubmitButton 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={!selectedExpertId || experts.length === 0}
                >
                  Next
                </SubmitButton>
              </ButtonGroup>
            </>
          )}

          {step === 2 && (
            <>
              <FormGroup>
                <Label htmlFor="goal">What is the goal of this call?</Label>
                <TextArea
                  id="goal"
                  value={goal}
                  onChange={handleGoalChange}
                  placeholder="e.g., Check mortgage approval status, Schedule property viewing, Request inspection timeline..."
                  required
                />
                <small>
                  Be specific about what information you need from the expert.
                  This will help the AI conduct a more effective call.
                </small>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setStep(1)}>
                  Back
                </Button>
                <SubmitButton 
                  type="button" 
                  onClick={() => setStep(3)}
                  disabled={!goal.trim()}
                >
                  Next
                </SubmitButton>
              </ButtonGroup>
            </>
          )}

          {step === 3 && selectedExpert && (
            <>
              <Title>Review Call Details</Title>
              
              <ExpertInfo>
                <ExpertInfoItem>
                  <ExpertInfoLabel>Expert:</ExpertInfoLabel>
                  {selectedExpert.name} {" "}
                  {renderExpertTypeTag(selectedExpert.expertType)}
                </ExpertInfoItem>
                <ExpertInfoItem>
                  <ExpertInfoLabel>Phone:</ExpertInfoLabel>
                  {selectedExpert.phoneNumber}
                </ExpertInfoItem>
                {selectedExpert.company && (
                  <ExpertInfoItem>
                    <ExpertInfoLabel>Company:</ExpertInfoLabel>
                    {selectedExpert.company}
                  </ExpertInfoItem>
                )}
                <ExpertInfoItem>
                  <ExpertInfoLabel>Goal:</ExpertInfoLabel>
                  {goal}
                </ExpertInfoItem>
              </ExpertInfo>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <ButtonGroup>
                <Button type="button" onClick={() => setStep(2)}>
                  Back
                </Button>
                <SubmitButton 
                  type="submit"
                  disabled={initiatingCall}
                >
                  {initiatingCall ? 'Initiating Call...' : 'Initiate Call'}
                </SubmitButton>
              </ButtonGroup>
            </>
          )}
        </Form>
      </FormContainer>
    </Container>
  );
};

export default CallInitiate; 