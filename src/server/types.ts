export type InvoiceItem = { desc: string; amt: number };

export type BookingRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  make: string;
  model: string;
  year: string;
  serviceType: string;
  date: string;
  time: string;
  issue: string;
  status: string;
  createdAt: string;
};

export type ContactRecord = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  vehicle?: string;
  message: string;
  status: string;
  createdAt: string;
};

export type InvoiceRecord = {
  id: string;
  number: string;
  customer: string;
  vehicle: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  status: "Pending" | "Paid" | "Overdue";
  stripeSessionId?: string;
  createdAt: string;
};

export type PublicInvoice = {
  number: string;
  customer: string;
  vehicle: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  status: string;
};
