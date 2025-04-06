import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Call Status Enum for frontend use
export enum CallStatus {
  PENDING = 'pending',
  DIALING = 'dialing',
  CONNECTED = 'connected',
  IN_PROGRESS = 'in_progress',
  SUMMARIZING = 'summarizing',
  NEEDS_FOLLOWUP = 'needs_followup',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Call interface for frontend use
interface Call {
  _id: string;
  goal: string;
  expertId: string;
  expertName: string;
  status: CallStatus;
  createdAt: string;
  completedAt?: string;
  durationSeconds?: number;
  summary?: string;
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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const CallsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #2c3e50;
`;

const CallLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #3498db;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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

const CallsList: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be a call to the actual API
        // For now, we'll simulate the API response
        setTimeout(() => {
          const mockCalls: Call[] = [
            {
              _id: '1',
              goal: 'Check mortgage approval status',
              expertId: '101',
              expertName: 'John Doe (Lender)',
              status: CallStatus.COMPLETED,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 mins later
              durationSeconds: 352,
              summary: 'Mortgage pre-approval for $450,000 confirmed. Rate locked at 3.75% for 60 days.',
            },
            {
              _id: '2',
              goal: 'Schedule property viewing',
              expertId: '102',
              expertName: 'Jane Smith (Realtor)',
              status: CallStatus.IN_PROGRESS,
              createdAt: new Date().toISOString(),
            },
            {
              _id: '3',
              goal: 'Request home inspection details',
              expertId: '103',
              expertName: 'Mike Johnson (Inspector)',
              status: CallStatus.PENDING,
              createdAt: new Date().toISOString(),
            },
            {
              _id: '4',
              goal: 'Verify closing timeline',
              expertId: '104',
              expertName: 'Sarah Williams (Attorney)',
              status: CallStatus.FAILED,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            },
          ];
          
          setCalls(mockCalls);
          setFilteredCalls(mockCalls);
          setLoading(false);
        }, 1000);
        
        // Actual API call would look like this:
        // const response = await axios.get('/api/calls');
        // setCalls(response.data.data);
        // setFilteredCalls(response.data.data);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching calls');
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  // Apply filter when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredCalls(calls);
    } else {
      setFilteredCalls(calls.filter(call => call.status === statusFilter));
    }
  }, [statusFilter, calls]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return <LoadingState>Loading calls...</LoadingState>;
  }

  return (
    <Container>
      <Header>
        <Title>Your Calls</Title>
        <ActionButton to="/initiate-call">New Call</ActionButton>
      </Header>

      {calls.length > 0 && (
        <FilterContainer>
          <FilterLabel htmlFor="statusFilter">Filter by status:</FilterLabel>
          <Select 
            id="statusFilter" 
            value={statusFilter} 
            onChange={handleFilterChange}
          >
            <option value="all">All Calls</option>
            <option value={CallStatus.PENDING}>Pending</option>
            <option value={CallStatus.DIALING}>Dialing</option>
            <option value={CallStatus.CONNECTED}>Connected</option>
            <option value={CallStatus.IN_PROGRESS}>In Progress</option>
            <option value={CallStatus.SUMMARIZING}>Summarizing</option>
            <option value={CallStatus.COMPLETED}>Completed</option>
            <option value={CallStatus.NEEDS_FOLLOWUP}>Needs Follow-up</option>
            <option value={CallStatus.FAILED}>Failed</option>
          </Select>
        </FilterContainer>
      )}

      {error && <p>Error: {error}</p>}

      {calls.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No calls found</EmptyStateTitle>
          <EmptyStateText>
            Start making automated calls to your experts.
          </EmptyStateText>
          <ActionButton to="/initiate-call">Make Your First Call</ActionButton>
        </EmptyState>
      ) : filteredCalls.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No calls match the selected filter</EmptyStateTitle>
          <EmptyStateText>
            Try a different status filter or clear the filter.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <CallsTable>
          <TableHead>
            <TableRow>
              <TableHeader>Goal</TableHeader>
              <TableHeader>Expert</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {filteredCalls.map((call) => (
              <TableRow key={call._id}>
                <TableCell>
                  <CallLink to={`/calls/${call._id}`}>
                    {call.goal}
                  </CallLink>
                </TableCell>
                <TableCell>{call.expertName}</TableCell>
                <TableCell>{formatDate(call.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={call.status}>
                    {formatStatus(call.status)}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </CallsTable>
      )}
    </Container>
  );
};

export default CallsList; 