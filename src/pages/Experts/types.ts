// Expert Type Enum
export enum ExpertType {
  REALTOR = 'realtor',
  LENDER = 'lender',
  INSPECTOR = 'inspector',
  APPRAISER = 'appraiser',
  ATTORNEY = 'attorney',
  INSURANCE_AGENT = 'insurance_agent',
  OTHER = 'other'
}

// Expert interface for frontend use
export interface Expert {
  _id: string;
  name: string;
  phoneNumber: string;
  expertType: ExpertType;
  company?: string;
  notes?: string;
} 