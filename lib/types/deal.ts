export interface Payment {
  id: string;
  dealId: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed" | string;
  method?: string;
  reference?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sku?: string;
  active?: boolean;
  quantity?: number;
  createdAt?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  leadId: string;
  ownerEmail?: string;
  company?: string;
  contactName?: string;
  expectedCloseDate?: string;
  closeDate?: string;
  won?: boolean;
  lostReason?: string;
  probability?: number;
  products?: { id: string; name: string; quantity: number; price: number }[];
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}
