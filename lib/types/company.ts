export interface Contact {
  id: string;
  companyId?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  isPrimary?: boolean;
  createdAt?: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  size?: string;
  tier?: string;
  annualRevenue?: number;
  ownerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
}
