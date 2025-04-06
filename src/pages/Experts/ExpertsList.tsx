import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ExpertType } from './types';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
`;

const ActionButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ExpertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ExpertCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ExpertName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ExpertTypeTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1976d2;
  margin-bottom: 1rem;
  text-transform: capitalize;
`;

const ExpertDetail = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #7f8c8d;
  margin-right: 0.5rem;
`;

const DetailValue = styled.span`
  color: #2c3e50;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

const Button = styled(Link)`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
`;

const EditButton = styled(Button)`
  background-color: #f8f9fa;
  color: #2c3e50;

  &:hover {
    background-color: #e9ecef;
  }
`;

const CallButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const EmptyStateText = styled.p`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
`;

// Expert interface
interface Expert {
  _id: string;
  name: string;
  phoneNumber: string;
  expertType: ExpertType;
  company?: string;
  notes?: string;
}

const ExpertsList: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a call to the actual API
        // For now, we'll simulate the API response
        setTimeout(() => {
          const mockExperts: Expert[] = [
            {
              _id: '1',
              name: 'John Doe',
              phoneNumber: '(555) 123-4567',
              expertType: ExpertType.REALTOR,
              company: 'ABC Realty',
              notes: 'Specializes in downtown properties',
            },
            {
              _id: '2',
              name: 'Jane Smith',
              phoneNumber: '(555) 987-6543',
              expertType: ExpertType.LENDER,
              company: 'XYZ Mortgage',
              notes: 'Quick pre-approvals',
            },
            {
              _id: '3',
              name: 'Mike Johnson',
              phoneNumber: '(555) 456-7890',
              expertType: ExpertType.INSPECTOR,
              company: 'Quality Home Inspections',
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

  // Format phone number
  const formatPhone = (phone: string) => {
    return phone;  // In a real app, you might want to format this
  };

  // Format expert type for display
  const formatExpertType = (type: string) => {
    return type.replace('_', ' ');
  };

  if (loading) {
    return <LoadingState>Loading experts...</LoadingState>;
  }

  return (
    <Container>
      <Header>
        <Title>Your Experts</Title>
        <ActionButton to="/experts/new">Add New Expert</ActionButton>
      </Header>

      {error && <p>Error: {error}</p>}

      {experts.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No experts added yet</EmptyStateTitle>
          <EmptyStateText>
            Add experts to make automated calls on your behalf.
          </EmptyStateText>
          <ActionButton to="/experts/new">Add Your First Expert</ActionButton>
        </EmptyState>
      ) : (
        <ExpertsGrid>
          {experts.map((expert) => (
            <ExpertCard key={expert._id}>
              <ExpertName>{expert.name}</ExpertName>
              <ExpertTypeTag>{formatExpertType(expert.expertType)}</ExpertTypeTag>
              
              <ExpertDetail>
                <DetailLabel>Phone:</DetailLabel>
                <DetailValue>{formatPhone(expert.phoneNumber)}</DetailValue>
              </ExpertDetail>
              
              {expert.company && (
                <ExpertDetail>
                  <DetailLabel>Company:</DetailLabel>
                  <DetailValue>{expert.company}</DetailValue>
                </ExpertDetail>
              )}
              
              {expert.notes && (
                <ExpertDetail>
                  <DetailLabel>Notes:</DetailLabel>
                  <DetailValue>{expert.notes}</DetailValue>
                </ExpertDetail>
              )}
              
              <ButtonGroup>
                <EditButton to={`/experts/${expert._id}`}>Edit</EditButton>
                <CallButton to={`/initiate-call?expert=${expert._id}`}>Call</CallButton>
              </ButtonGroup>
            </ExpertCard>
          ))}
        </ExpertsGrid>
      )}
    </Container>
  );
};

export default ExpertsList; 