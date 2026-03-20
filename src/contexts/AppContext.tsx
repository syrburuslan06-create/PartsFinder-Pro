import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert, GeminiSearchResult } from '../types';
import { AlertsService } from '../services/alertsService';

export type UserRole = 'super_admin' | 'director' | 'worker' | 'supplier';

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface Part {
  id: number;
  name: string;
  partNumber: string;
  supplier: string;
  price: number | string;
  status: string;
  compatible?: boolean;
  savedAt?: string;
}

interface Vehicle {
  id: string;
  type: 'truck' | 'car';
  make: string;
  model: string;
  year: string;
  engine: string;
  vin?: string;
  name: string;
  status?: 'active' | 'maintenance' | 'inactive';
  lastService?: string;
}

export interface SearchEntry {
  query: string;
  vehicleInfo: string;
  timestamp: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  savedParts: Part[];
  setSavedParts: React.Dispatch<React.SetStateAction<Part[]>>;
  searchHistory: SearchEntry[];
  setSearchHistory: React.Dispatch<React.SetStateAction<SearchEntry[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  inventory: Vehicle[];
  setInventory: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  workers: any[];
  setWorkers: React.Dispatch<React.SetStateAction<any[]>>;
  fetchAlerts: () => Promise<void>;
  markAlertAsRead: (id: string) => Promise<void>;
  markAllAlertsAsRead: () => Promise<void>;
  deleteAllAlerts: () => Promise<void>;
  totalSearches: number;
  incrementSearches: () => void;
  isOffline: boolean;
  featureFlags: Record<string, boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    enableTrustScore: true,
    enableCompare: true,
    enableAIAssistant: true,
    enableOfflineSync: true,
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!error && data) {
            const updatedUser = {
              id: user.id,
              name: data.full_name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              role: data.role as UserRole,
              companyName: data.company_name,
              createdAt: data.created_at,
              isPaid: data.is_paid,
              plan: data.plan
            } as any;
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const [savedParts, setSavedParts] = useState<Part[]>(() => {
    const saved = localStorage.getItem('savedParts');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    const fetchSavedParts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('saved_parts')
            .select('*')
            .eq('mechanic_id', user.id);
            
          if (!error && data) {
            const mappedParts = data.map(item => ({
              id: item.id,
              partName: item.part_name,
              name: item.part_name,
              partNumber: item.part_number,
              supplier: 'Saved',
              price: item.price,
              status: 'In Stock',
              savedAt: item.created_at,
              image: `https://picsum.photos/seed/${item.part_number}/400/300`
            }));
            setSavedParts(mappedParts as any);
          }
        }
      } catch (error) {
        console.error('Error fetching saved parts:', error);
      }
    };
    fetchSavedParts();
  }, []);

  const [searchHistory, setSearchHistory] = useState<SearchEntry[]>([]);
  
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('search_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (!error && data) {
            const mappedHistory = data.map(item => ({
              query: item.query,
              vehicleInfo: item.search_type || 'Unknown Vehicle',
              timestamp: item.created_at
            }));
            setSearchHistory(mappedHistory);
          }
        }
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };
    fetchSearchHistory();
  }, []);

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    const data = await AlertsService.fetchAlerts();
    setAlerts(data);
  };

  const markAlertAsRead = async (id: string) => {
    const success = await AlertsService.markAsRead(id);
    if (success) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    }
  };

  const markAllAlertsAsRead = async () => {
    const success = await AlertsService.markAllAsRead();
    if (success) {
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    }
  };

  const deleteAllAlerts = async () => {
    const success = await AlertsService.deleteAllAlerts();
    if (success) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    AlertsService.checkMaintenance(); // Check maintenance on load

    // Real-time alerts listener
    const channel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts' 
      }, (payload) => {
        setAlerts(prev => [payload.new as Alert, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [inventory, setInventory] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (!error && data) {
            const mappedInventory = data.map(item => ({
              id: item.id,
              type: item.type as 'truck' | 'car',
              make: item.make,
              model: item.model,
              year: item.year,
              engine: item.engine,
              vin: item.vin,
              name: item.name,
              status: item.status,
              lastService: item.last_service
            }));
            setInventory(mappedInventory);
          }
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  const [workers, setWorkers] = useState<any[]>([]);
  const [totalSearches, setTotalSearches] = useState(() => {
    const saved = localStorage.getItem('totalSearches');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // First get the company ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();
            
          if (profile?.company_id) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('company_id', profile.company_id);
              
            if (!error && data) {
              const mappedWorkers = data.map(item => ({
                id: item.id,
                name: item.full_name || 'Worker',
                email: item.email,
                role: item.role,
                status: 'active',
                joinedAt: item.created_at
              }));
              setWorkers(mappedWorkers);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('totalSearches', totalSearches.toString());
  }, [totalSearches]);

  useEffect(() => {
    localStorage.setItem('savedParts', JSON.stringify(savedParts));
  }, [savedParts]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  const incrementSearches = () => {
    setTotalSearches(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      savedParts, setSavedParts,
      searchHistory, setSearchHistory,
      alerts, setAlerts,
      fetchAlerts, markAlertAsRead, markAllAlertsAsRead, deleteAllAlerts,
      inventory, setInventory,
      workers, setWorkers,
      totalSearches, incrementSearches,
      isOffline, featureFlags
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
