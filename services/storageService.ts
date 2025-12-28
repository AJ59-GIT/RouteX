
const PREFIX = 'omniroute_';

export const storageService = {
  /**
   * Save data with an optional expiration in milliseconds.
   * Simulates a "Write-Through" cache to a cloud provider.
   */
  set: async (key: string, value: any, ttl?: number) => {
    const item = {
      value,
      expiry: ttl ? Date.now() + ttl : null,
      syncedAt: new Date().toISOString()
    };
    
    // Simulate network latency for "cloud sync"
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem(PREFIX + key, JSON.stringify(item));
  },

  /**
   * Get data and check for expiration.
   */
  get: <T>(key: string): T | null => {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;

    try {
      const item = JSON.parse(raw);
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(PREFIX + key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  },

  /**
   * Simulates fetching fresh data from a cloud instance (Supabase/Firebase)
   */
  syncFromCloud: async (userId: string): Promise<any> => {
    console.debug(`[CloudSync] Fetching remote state for ${userId}...`);
    await new Promise(r => setTimeout(r, 1200));
    // In a real app, this is where 'supabase.from("profiles").select()...' goes
    return null; 
  },

  remove: (key: string) => {
    localStorage.removeItem(PREFIX + key);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
