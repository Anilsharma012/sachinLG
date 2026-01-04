import Dexie, { Table } from 'dexie';

// Define offline data types
export interface CachedLoan {
  id: string;
  loanNumber: string;
  productName: string;
  amount: number;
  emiAmount: number;
  status: string;
  nextEmiDate?: string;
  syncedAt: number;
}

export interface CachedLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  amount: number;
  stage: string;
  source: string;
  nextFollowUp?: string;
  syncedAt: number;
}

export interface CachedEmi {
  id: string;
  loanId: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  syncedAt: number;
}

export interface CachedNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  syncedAt: number;
}

export interface SyncQueue {
  id?: number;
  action: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  createdAt: number;
  retries: number;
}

// Extend Dexie
class OfflineDatabase extends Dexie {
  loans!: Table<CachedLoan>;
  leads!: Table<CachedLead>;
  emis!: Table<CachedEmi>;
  notifications!: Table<CachedNotification>;
  syncQueue!: Table<SyncQueue>;

  constructor() {
    super('LoanCloudOffline');
    
    this.version(1).stores({
      loans: 'id, loanNumber, status, syncedAt',
      leads: 'id, stage, syncedAt',
      emis: 'id, loanId, dueDate, status, syncedAt',
      notifications: 'id, type, read, syncedAt',
      syncQueue: '++id, entity, action, createdAt'
    });
  }
}

export const offlineDb = new OfflineDatabase();

// Offline data service
export const offlineService = {
  // Loans
  async cacheLoans(loans: CachedLoan[]) {
    const now = Date.now();
    const loansWithSync = loans.map(loan => ({ ...loan, syncedAt: now }));
    await offlineDb.loans.bulkPut(loansWithSync);
  },

  async getCachedLoans(): Promise<CachedLoan[]> {
    return await offlineDb.loans.toArray();
  },

  // Leads
  async cacheLeads(leads: CachedLead[]) {
    const now = Date.now();
    const leadsWithSync = leads.map(lead => ({ ...lead, syncedAt: now }));
    await offlineDb.leads.bulkPut(leadsWithSync);
  },

  async getCachedLeads(): Promise<CachedLead[]> {
    return await offlineDb.leads.toArray();
  },

  // EMIs
  async cacheEmis(emis: CachedEmi[]) {
    const now = Date.now();
    const emisWithSync = emis.map(emi => ({ ...emi, syncedAt: now }));
    await offlineDb.emis.bulkPut(emisWithSync);
  },

  async getCachedEmis(): Promise<CachedEmi[]> {
    return await offlineDb.emis.toArray();
  },

  async getUpcomingEmis(): Promise<CachedEmi[]> {
    const today = new Date().toISOString().split('T')[0];
    return await offlineDb.emis
      .where('dueDate')
      .aboveOrEqual(today)
      .and(emi => emi.status === 'pending')
      .toArray();
  },

  // Notifications
  async cacheNotifications(notifications: CachedNotification[]) {
    const now = Date.now();
    const notificationsWithSync = notifications.map(n => ({ ...n, syncedAt: now }));
    await offlineDb.notifications.bulkPut(notificationsWithSync);
  },

  async getCachedNotifications(): Promise<CachedNotification[]> {
    return await offlineDb.notifications.orderBy('syncedAt').reverse().toArray();
  },

  // Sync Queue
  async addToSyncQueue(action: SyncQueue['action'], entity: string, data: any) {
    await offlineDb.syncQueue.add({
      action,
      entity,
      data,
      createdAt: Date.now(),
      retries: 0
    });
  },

  async getPendingSyncs(): Promise<SyncQueue[]> {
    return await offlineDb.syncQueue.toArray();
  },

  async removeSyncItem(id: number) {
    await offlineDb.syncQueue.delete(id);
  },

  async incrementRetry(id: number) {
    await offlineDb.syncQueue.update(id, { retries: (await offlineDb.syncQueue.get(id))?.retries || 0 + 1 });
  },

  // Clear old cache
  async clearOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAgeMs;
    await offlineDb.loans.where('syncedAt').below(cutoff).delete();
    await offlineDb.leads.where('syncedAt').below(cutoff).delete();
    await offlineDb.emis.where('syncedAt').below(cutoff).delete();
    await offlineDb.notifications.where('syncedAt').below(cutoff).delete();
  },

  // Get last sync time
  async getLastSyncTime(entity: string): Promise<number | null> {
    let table;
    switch (entity) {
      case 'loans': table = offlineDb.loans; break;
      case 'leads': table = offlineDb.leads; break;
      case 'emis': table = offlineDb.emis; break;
      case 'notifications': table = offlineDb.notifications; break;
      default: return null;
    }
    const latest = await table.orderBy('syncedAt').last();
    return latest?.syncedAt || null;
  }
};
