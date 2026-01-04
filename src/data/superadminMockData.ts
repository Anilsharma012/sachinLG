// SuperAdmin Mock Data

export interface Organization {
  id: string;
  name: string;
  brand: string;
  gstin?: string;
  email: string;
  contactEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  plan: 'trial' | 'starter' | 'professional' | 'enterprise';
  planStatus: 'trial' | 'active' | 'expired' | 'suspended';
  trialEndsAt?: Date;
  subscriptionStartAt?: Date;
  subscriptionEndAt?: Date;
  maxAgents: number;
  maxCustomers: number;
  storageLimit: number;
  storageUsed: number;
  totalAgents: number;
  totalCustomers: number;
  totalUsers: number;
  totalLoans: number;
  totalDisbursed: number;
  totalCollected: number;
  lastLoginAt?: Date;
  createdAt: Date;
  status: 'active' | 'suspended' | 'blocked';
}

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'superadmin' | 'support' | 'billing' | 'auditor';
  permissions: string[];
  status: 'active' | 'blocked';
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxAgents: number;
  maxCustomers: number;
  storageGB: number;
  features: string[];
  status: 'active' | 'inactive';
  isPopular?: boolean;
  limits: {
    maxAgents: number;
    maxCustomers: number;
    storageGB: number;
  };
}

export interface Subscription {
  id: string;
  orgId: string;
  orgName: string;
  planId: string;
  planName: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  startAt: Date;
  endAt: Date;
  nextBillingAt?: Date;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

export interface SystemError {
  id: string;
  orgId?: string;
  orgName?: string;
  userId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  errorMessage: string;
  stack?: string;
  createdAt: Date;
}

export interface WebhookLog {
  id: string;
  orgId?: string;
  orgName?: string;
  provider: string;
  eventType: string;
  status: 'success' | 'failed' | 'pending';
  retries: number;
  lastTriedAt: Date;
  createdAt: Date;
}

export interface GlobalAuditLog {
  id: string;
  actorType: 'platformAdmin' | 'user';
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
  orgId?: string;
  orgName?: string;
  oldValue?: string;
  newValue?: string;
  impersonation?: {
    realActorId: string;
    impersonatedUserId: string;
    reason: string;
  };
  ip?: string;
  ipAddress: string;
  createdAt: Date;
  details?: {
    impersonatedUser?: string;
    reason?: string;
    duration?: string;
    [key: string]: unknown;
  };
}

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: 'org_001',
    name: 'Vikram Finance Pvt Ltd',
    brand: 'Vikram Finance',
    gstin: '27AAACV1234M1Z5',
    email: 'admin@vikramfinance.com',
    contactEmail: 'admin@vikramfinance.com',
    phone: '+91 9876543210',
    address: '123, Commercial Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    plan: 'professional',
    planStatus: 'active',
    subscriptionStartAt: new Date('2024-01-01'),
    subscriptionEndAt: new Date('2025-01-01'),
    maxAgents: 10,
    maxCustomers: 500,
    storageLimit: 50,
    storageUsed: 12500,
    totalAgents: 8,
    totalCustomers: 342,
    totalUsers: 350,
    totalLoans: 156,
    totalDisbursed: 45000000,
    totalCollected: 38000000,
    lastLoginAt: new Date('2024-12-30'),
    createdAt: new Date('2023-06-15'),
    status: 'active',
  },
  {
    id: 'org_002',
    name: 'FinServe Partners LLP',
    brand: 'FinServe',
    gstin: '29BBBFS5678N2Z8',
    email: 'contact@finserve.in',
    contactEmail: 'contact@finserve.in',
    phone: '+91 8765432109',
    address: '456, Tech Park',
    city: 'Bangalore',
    state: 'Karnataka',
    plan: 'enterprise',
    planStatus: 'active',
    subscriptionStartAt: new Date('2024-03-01'),
    subscriptionEndAt: new Date('2025-03-01'),
    maxAgents: 50,
    maxCustomers: 5000,
    storageLimit: 200,
    storageUsed: 85000,
    totalAgents: 35,
    totalCustomers: 1250,
    totalUsers: 1285,
    totalLoans: 580,
    totalDisbursed: 180000000,
    totalCollected: 145000000,
    lastLoginAt: new Date('2024-12-31'),
    createdAt: new Date('2023-01-10'),
    status: 'active',
  },
  {
    id: 'org_003',
    name: 'QuickLoans India',
    brand: 'QuickLoans',
    email: 'hello@quickloans.in',
    contactEmail: 'hello@quickloans.in',
    phone: '+91 7654321098',
    address: '789, Business Hub',
    city: 'Delhi',
    state: 'Delhi',
    plan: 'starter',
    planStatus: 'trial',
    trialEndsAt: new Date('2025-01-15'),
    maxAgents: 3,
    maxCustomers: 100,
    storageLimit: 10,
    storageUsed: 2500,
    totalAgents: 2,
    totalCustomers: 45,
    totalUsers: 47,
    totalLoans: 18,
    totalDisbursed: 3500000,
    totalCollected: 2800000,
    lastLoginAt: new Date('2024-12-28'),
    createdAt: new Date('2024-12-01'),
    status: 'active',
  },
  {
    id: 'org_004',
    name: 'Reliable Loans Co',
    brand: 'Reliable Loans',
    gstin: '33CCCRL9012P3Z1',
    email: 'info@reliableloans.com',
    contactEmail: 'info@reliableloans.com',
    phone: '+91 6543210987',
    address: '321, Finance Tower',
    city: 'Chennai',
    state: 'Tamil Nadu',
    plan: 'professional',
    planStatus: 'expired',
    subscriptionStartAt: new Date('2024-01-01'),
    subscriptionEndAt: new Date('2024-12-01'),
    maxAgents: 10,
    maxCustomers: 500,
    storageLimit: 50,
    storageUsed: 35000,
    totalAgents: 6,
    totalCustomers: 280,
    totalUsers: 286,
    totalLoans: 120,
    totalDisbursed: 32000000,
    totalCollected: 28000000,
    lastLoginAt: new Date('2024-12-15'),
    createdAt: new Date('2023-08-20'),
    status: 'suspended',
  },
];

// Mock Platform Admins
export const mockPlatformAdmins: PlatformAdmin[] = [
  {
    id: 'padm_001',
    name: 'Rajiv Mehta',
    email: 'rajiv@loanagent.com',
    mobile: '+91 9999888877',
    role: 'superadmin',
    permissions: ['all'],
    status: 'active',
    lastLoginAt: new Date('2024-12-31'),
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'padm_002',
    name: 'Sneha Gupta',
    email: 'sneha@loanagent.com',
    mobile: '+91 9999777766',
    role: 'support',
    permissions: ['view_orgs', 'view_users', 'impersonate', 'view_errors'],
    status: 'active',
    lastLoginAt: new Date('2024-12-30'),
    createdAt: new Date('2023-03-15'),
  },
  {
    id: 'padm_003',
    name: 'Amit Sharma',
    email: 'amit@loanagent.com',
    mobile: '+91 9999666655',
    role: 'billing',
    permissions: ['view_orgs', 'manage_subscriptions', 'view_invoices'],
    status: 'active',
    lastLoginAt: new Date('2024-12-29'),
    createdAt: new Date('2023-06-01'),
  },
];

// Mock Plans
export const mockPlans: Plan[] = [
  {
    id: 'plan_trial',
    name: 'Trial',
    priceMonthly: 0,
    priceYearly: 0,
    maxAgents: 2,
    maxCustomers: 50,
    storageGB: 5,
    features: ['Basic KYC', 'EMI Tracking', 'Email Support'],
    status: 'active',
    limits: { maxAgents: 2, maxCustomers: 50, storageGB: 5 },
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    priceMonthly: 2999,
    priceYearly: 29990,
    maxAgents: 3,
    maxCustomers: 100,
    storageGB: 10,
    features: ['Basic KYC', 'EMI Tracking', 'Email Support', 'Payment Gateway'],
    status: 'active',
    limits: { maxAgents: 3, maxCustomers: 100, storageGB: 10 },
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    priceMonthly: 7999,
    priceYearly: 79990,
    maxAgents: 10,
    maxCustomers: 500,
    storageGB: 50,
    features: ['Advanced KYC', 'EMI Tracking', 'Priority Support', 'Payment Gateway', 'Custom Branding', 'Reports'],
    status: 'active',
    isPopular: true,
    limits: { maxAgents: 10, maxCustomers: 500, storageGB: 50 },
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    priceMonthly: 19999,
    priceYearly: 199990,
    maxAgents: -1,
    maxCustomers: -1,
    storageGB: 200,
    features: ['Full KYC Suite', 'EMI Tracking', 'Dedicated Support', 'Payment Gateway', 'Custom Branding', 'Advanced Reports', 'API Access', 'SLA'],
    status: 'active',
    limits: { maxAgents: -1, maxCustomers: -1, storageGB: 200 },
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_001',
    orgId: 'org_001',
    orgName: 'Vikram Finance Pvt Ltd',
    planId: 'plan_professional',
    planName: 'Professional',
    status: 'active',
    startAt: new Date('2024-01-01'),
    endAt: new Date('2025-01-01'),
    nextBillingAt: new Date('2025-01-01'),
    amount: 79990,
    paymentStatus: 'paid',
  },
  {
    id: 'sub_002',
    orgId: 'org_002',
    orgName: 'FinServe Partners LLP',
    planId: 'plan_enterprise',
    planName: 'Enterprise',
    status: 'active',
    startAt: new Date('2024-03-01'),
    endAt: new Date('2025-03-01'),
    nextBillingAt: new Date('2025-03-01'),
    amount: 199990,
    paymentStatus: 'paid',
  },
  {
    id: 'sub_003',
    orgId: 'org_004',
    orgName: 'Reliable Loans Co',
    planId: 'plan_professional',
    planName: 'Professional',
    status: 'expired',
    startAt: new Date('2024-01-01'),
    endAt: new Date('2024-12-01'),
    amount: 79990,
    paymentStatus: 'overdue',
  },
];

// Mock System Errors
export const mockSystemErrors: SystemError[] = [
  {
    id: 'err_001',
    orgId: 'org_001',
    orgName: 'Vikram Finance',
    endpoint: '/api/v1/payments/verify',
    method: 'POST',
    statusCode: 500,
    errorMessage: 'Payment gateway timeout',
    createdAt: new Date('2024-12-30T14:30:00'),
  },
  {
    id: 'err_002',
    orgId: 'org_002',
    orgName: 'FinServe',
    endpoint: '/api/v1/kyc/verify',
    method: 'POST',
    statusCode: 502,
    errorMessage: 'Aadhaar service unavailable',
    createdAt: new Date('2024-12-30T10:15:00'),
  },
  {
    id: 'err_003',
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    statusCode: 429,
    errorMessage: 'Too many login attempts',
    createdAt: new Date('2024-12-29T22:45:00'),
  },
];

// Mock Webhook Logs
export const mockWebhookLogs: WebhookLog[] = [
  {
    id: 'wh_001',
    orgId: 'org_001',
    orgName: 'Vikram Finance',
    provider: 'Razorpay',
    eventType: 'payment.captured',
    status: 'success',
    retries: 0,
    lastTriedAt: new Date('2024-12-30T16:00:00'),
    createdAt: new Date('2024-12-30T16:00:00'),
  },
  {
    id: 'wh_002',
    orgId: 'org_002',
    orgName: 'FinServe',
    provider: 'Cashfree',
    eventType: 'payment.failed',
    status: 'failed',
    retries: 3,
    lastTriedAt: new Date('2024-12-30T15:30:00'),
    createdAt: new Date('2024-12-30T14:00:00'),
  },
];

// Mock Global Audit Logs
export const mockGlobalAuditLogs: GlobalAuditLog[] = [
  {
    id: 'audit_001',
    actorType: 'platformAdmin',
    actorId: 'padm_001',
    actorName: 'Rajiv Mehta',
    action: 'suspended',
    entity: 'organization',
    entityId: 'org_004',
    orgId: 'org_004',
    orgName: 'Reliable Loans Co',
    newValue: 'suspended',
    oldValue: 'active',
    ip: '103.45.67.89',
    ipAddress: '103.45.67.89',
    createdAt: new Date('2024-12-28T10:00:00'),
  },
  {
    id: 'audit_002',
    actorType: 'platformAdmin',
    actorId: 'padm_002',
    actorName: 'Sneha Gupta',
    action: 'impersonated',
    entity: 'user',
    entityId: 'usr_agent_001',
    orgId: 'org_001',
    orgName: 'Vikram Finance',
    impersonation: {
      realActorId: 'padm_002',
      impersonatedUserId: 'usr_agent_001',
      reason: 'Customer support ticket #45678',
    },
    ip: '103.45.67.90',
    ipAddress: '103.45.67.90',
    createdAt: new Date('2024-12-27T14:30:00'),
    details: {
      impersonatedUser: 'Rahul Sharma',
      reason: 'Customer support ticket #45678',
      duration: '8 min',
    },
  },
  {
    id: 'audit_003',
    actorType: 'platformAdmin',
    actorId: 'padm_003',
    actorName: 'Amit Sharma',
    action: 'renewed',
    entity: 'subscription',
    entityId: 'sub_002',
    orgId: 'org_002',
    orgName: 'FinServe Partners LLP',
    ip: '103.45.67.91',
    ipAddress: '103.45.67.91',
    createdAt: new Date('2024-12-25T11:00:00'),
  },
];

// Dashboard Stats
export const mockPlatformStats = {
  totalOrganizations: 4,
  activeOrganizations: 2,
  trialOrganizations: 1,
  expiredOrganizations: 1,
  totalUsers: 1892,
  totalAgents: 51,
  totalCustomers: 1917,
  totalApplicationsToday: 45,
  totalApplicationsMTD: 892,
  totalDisbursedToday: 12500000,
  totalDisbursedMTD: 260000000,
  totalCollectionToday: 8500000,
  totalCollectionMTD: 213000000,
  overdueCount: 156,
  platformRevenueMTD: 359960,
  apiUptime: 99.95,
  errorRate: 0.12,
  webhookFailures: 3,
};
