// Core Types for Loan Agent SaaS

export type UserRole = 'super_admin' | 'org_admin' | 'manager' | 'agent' | 'verifier' | 'finance' | 'customer';

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'doc_pending'
  | 'kyc_pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'disbursed'
  | 'active'
  | 'closed';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type EmiStatus = 'upcoming' | 'due' | 'overdue' | 'partial' | 'paid';
export type PaymentStatus = 'initiated' | 'success' | 'failed' | 'refunded' | 'reconciled';
export type KycStatus = 'draft' | 'submitted' | 'verified' | 'rejected' | 'resubmitted';
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface User {
  id: string;
  orgId: string;
  role: UserRole;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  status: 'active' | 'blocked';
  kycStatus?: KycStatus;
  createdAt: Date;
}

export interface Lead {
  id: string;
  orgId: string;
  name: string;
  mobile: string;
  email?: string;
  source: string;
  stage: LeadStage;
  interestedProduct?: string;
  assignedAgentId?: string;
  nextFollowUp?: Date;
  notes: string[];
  createdAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  orgId: string;
  name: string;
  dob: Date;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  email: string;
  panMasked: string;
  aadhaarMasked: string;
  currentAddress: Address;
  permanentAddress: Address;
  employmentType: 'salaried' | 'self_employed' | 'business';
  companyName?: string;
  monthlyIncome: number;
  bankDetails: BankDetails;
  kycStatus: KycStatus;
  assignedAgentId?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName: string;
}

export interface LoanProduct {
  id: string;
  orgId: string;
  name: string;
  code: string;
  minAmount: number;
  maxAmount: number;
  tenureOptions: number[];
  interestType: 'flat' | 'reducing';
  baseRate: number;
  processingFee: { type: 'fixed' | 'percent'; value: number };
  requiredDocs: string[];
  status: 'active' | 'inactive';
}

export interface LoanApplication {
  id: string;
  applicationNo: string;
  orgId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  requestedAmount: number;
  tenure: number;
  purpose: string;
  status: ApplicationStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  sanction?: SanctionDetails;
  statusTimeline: StatusTimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SanctionDetails {
  approvedAmount: number;
  interestRate: number;
  processingFee: number;
  insuranceFee: number;
  emiStartDate: Date;
  emiAmount: number;
}

export interface StatusTimelineEntry {
  status: ApplicationStatus;
  timestamp: Date;
  remarks?: string;
  actorId: string;
  actorName: string;
}

export interface Document {
  id: string;
  applicationId: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: DocumentStatus;
  remarks?: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
}

export interface LoanAccount {
  id: string;
  loanAccountNo: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  orgId: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  disbursalDate: Date;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  outstandingPrincipal: number;
  outstandingTotal: number;
  status: 'active' | 'closed';
  productName: string;
}

export interface EmiSchedule {
  id: string;
  loanAccountId: string;
  installmentNo: number;
  dueDate: Date;
  principal: number;
  interest: number;
  total: number;
  status: EmiStatus;
  paidAmount: number;
  lateFee: number;
  paidDate?: Date;
}

export interface Payment {
  id: string;
  loanAccountId: string;
  customerId: string;
  amount: number;
  mode: 'gateway' | 'upi' | 'bank' | 'cash';
  txnId: string;
  gatewayRef?: string;
  status: PaymentStatus;
  receiptNo?: string;
  allocations: { emiId: string; amount: number }[];
  createdAt: Date;
  reconciledAt?: Date;
}

export interface Commission {
  id: string;
  agentId: string;
  agentName: string;
  loanAccountId: string;
  customerName: string;
  disbursedAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: Date;
}

export interface DashboardStats {
  totalLeads: number;
  totalApplications: number;
  approvedLoans: number;
  disbursedAmount: number;
  collectionsToday: number;
  overdueCount: number;
  pendingKyc: number;
  activeAgents: number;
}
