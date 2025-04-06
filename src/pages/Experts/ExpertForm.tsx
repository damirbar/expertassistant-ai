import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
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

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
`;

const ExpertForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    expertType: ExpertType.OTHER,
    company: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingExpert, setFetchingExpert] = useState(isEditMode);

  useEffect(() => {
    const fetchExpert = async () => {
      if (!isEditMode) return;
      
      try {
        setFetchingExpert(true);
        
        // In a real app, this would be a call to the actual API
        // For now, we'll simulate the API response
        setTimeout(() => {
          // This is a mock expert for demonstration
          const mockExpert = {
            _id: id,
            name: 'John Doe',
            phoneNumber: '(555) 123-4567',
            expertType: ExpertType.REALTOR,
            company: 'ABC Realty',
            notes: 'Specializes in downtown properties',
          };
          
          setFormData({
            name: mockExpert.name,
            phoneNumber: mockExpert.phoneNumber,
            expertType: mockExpert.expertType,
            company: mockExpert.company || '',
            notes: mockExpert.notes || '',
          });
          
          setFetchingExpert(false);
        }, 1000);
        
        // Actual API call would look like this:
        // const response = await axios.get(`/api/experts/${id}`);
        // const expert = response.data.data;
        // setFormData({
        //   name: expert.name,
        //   phoneNumber: expert.phoneNumber,
        //   expertType: expert.expertType,
        //   company: expert.company || '',
        //   notes: expert.notes || '',
        // });
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching expert details');
        setFetchingExpert(false);
      }
    };

    fetchExpert();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const { name, phoneNumber, expertType, company, notes } = formData;
      
      // Basic validation
      if (!name || !phoneNumber || !expertType) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Prepare data for API
      const expertData = {
        name,
        phoneNumber,
        expertType,
        company: company || undefined,
        notes: notes || undefined,
      };
      
      // In a real app, this would be a call to the actual API
      // For now, we'll simulate the API response
      setTimeout(() => {
        console.log('Expert saved:', expertData);
        setLoading(false);
        navigate('/experts');
      }, 1000);
      
      // Actual API call would look like this:
      // if (isEditMode) {
      //   await axios.put(`/api/experts/${id}`, expertData);
      // } else {
      //   await axios.post('/api/experts', expertData);
      // }
      // navigate('/experts');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving expert');
      setLoading(false);
    }
  };

  if (fetchingExpert) {
    return <div>Loading expert details...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>{isEditMode ? 'Edit Expert' : 'Add New Expert'}</Title>
      </Header>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Name*</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phoneNumber">Phone Number*</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="expertType">Expert Type*</Label>
              <Select
                id="expertType"
                name="expertType"
                value={formData.expertType}
                onChange={handleChange}
                required
              >
                <option value={ExpertType.REALTOR}>Realtor</option>
                <option value={ExpertType.LENDER}>Lender</option>
                <option value={ExpertType.INSPECTOR}>Inspector</option>
                <option value={ExpertType.APPRAISER}>Appraiser</option>
                <option value={ExpertType.ATTORNEY}>Attorney</option>
                <option value={ExpertType.INSURANCE_AGENT}>Insurance Agent</option>
                <option value={ExpertType.OTHER}>Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this expert"
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <CancelButton to="/experts">Cancel</CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Expert'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ExpertForm; 