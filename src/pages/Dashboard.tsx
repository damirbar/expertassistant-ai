import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { CallStatus } from './Calls/CallsList';

// Styled components
const DashboardContainer = styled.div`
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

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
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

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const CardContent = styled.div`
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const StatLabel = styled.span`
  color: #7f8c8d;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const CardButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.75rem;
  background-color: #f8f9fa;
  color: #2c3e50;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #2c3e50;
`;

const CallsList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CallsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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

// Interface for stats
interface DashboardStats {
  totalExperts: number;
  totalCalls: number;
  recentCalls: RecentCall[];
}

// Interface for recent calls
interface RecentCall {
  _id: string;
  goal: string;
  status: CallStatus;
  expertName: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalExperts: 0,
    totalCalls: 0,
    recentCalls: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch real data from the backend
    // This is a placeholder for demonstration
    const fetchData = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalExperts: 5,
          totalCalls: 12,
          recentCalls: [
            {
              _id: '1',
              goal: 'Check mortgage approval status',
              status: CallStatus.COMPLETED,
              expertName: 'John Doe (Lender)',
              createdAt: new Date().toISOString(),
            },
            {
              _id: '2',
              goal: 'Schedule property viewing',
              status: CallStatus.IN_PROGRESS,
              expertName: 'Jane Smith (Realtor)',
              createdAt: new Date().toISOString(),
            },
            {
              _id: '3',
              goal: 'Request home inspection details',
              status: CallStatus.PENDING,
              expertName: 'Mike Johnson (Inspector)',
              createdAt: new Date().toISOString(),
            },
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Welcome, {user?.firstName}!</Title>
        <ActionButton to="/initiate-call">
          New Call
        </ActionButton>
      </Header>

      <CardContainer>
        <Card>
          <CardTitle>Experts</CardTitle>
          <CardContent>
            <Stat>
              <StatLabel>Total Experts:</StatLabel>
              <StatValue>{stats.totalExperts}</StatValue>
            </Stat>
          </CardContent>
          <CardButton to="/experts">Manage Experts</CardButton>
        </Card>

        <Card>
          <CardTitle>Calls</CardTitle>
          <CardContent>
            <Stat>
              <StatLabel>Total Calls:</StatLabel>
              <StatValue>{stats.totalCalls}</StatValue>
            </Stat>
          </CardContent>
          <CardButton to="/calls">View All Calls</CardButton>
        </Card>
      </CardContainer>

      <SectionTitle>Recent Calls</SectionTitle>
      <CallsList>
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
            {stats.recentCalls.map((call) => (
              <TableRow key={call._id}>
                <TableCell>
                  <Link to={`/calls/${call._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {call.goal}
                  </Link>
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
      </CallsList>
    </DashboardContainer>
  );
};

export default Dashboard; 