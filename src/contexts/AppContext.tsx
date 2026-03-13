import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'super_admin' | 'individual' | 'director' | 'worker';

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

interface Alert {
  id: number;
  type: 'price_drop' | 'back_in_stock';
  partName: string;
  partNumber: string;
  currentPrice: string;
  status: 'active' | 'inactive';
}

interface Vehicle {
  id: number;
  type: 'truck' | 'car';
  make: string;
  model: string;
  year: string;
  engine: string;
  vin?: string;
  nickname?: string;
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
  totalSearches: number;
  incrementSearches: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

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

  const [searchHistory, setSearchHistory] = useState<SearchEntry[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) return JSON.parse(saved);
    return [];
  });
  
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('alerts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, type: "price_drop", partName: "Air Brake Compressor", partNumber: "5018485X", currentPrice: "$589.99", status: "active" },
      { id: 2, type: "back_in_stock", partName: "Turbocharger Assembly", partNumber: "3592778", currentPrice: "$1,249.00", status: "active" }
    ];
  });

  const [inventory, setInventory] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, type: "truck", make: "Freightliner", model: "Cascadia", year: "2019", engine: "Cummins ISX15", vin: "1FUJGLDR5CSBL8266", nickname: "Unit 42" },
      { id: 2, type: "truck", make: "Kenworth", model: "T680", year: "2021", engine: "PACCAR MX-13", vin: "", nickname: "Big Red" }
    ];
  });

  const [workers, setWorkers] = useState<any[]>(() => {
    const saved = localStorage.getItem('workers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Marcus Johnson", email: "marcus@fleet.com", status: "active", searches: 47, avatar: "M" },
      { id: 2, name: "Sarah Chen", email: "sarah@fleet.com", status: "active", searches: 31, avatar: "S" },
      { id: 3, name: "Derek Williams", email: "derek@fleet.com", status: "pending", searches: 0, avatar: "D" }
    ];
  });

  const [totalSearches, setTotalSearches] = useState(() => {
    const saved = localStorage.getItem('totalSearches');
    return saved ? parseInt(saved, 10) : 0;
  });

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
      inventory, setInventory,
      workers, setWorkers,
      totalSearches, incrementSearches
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
