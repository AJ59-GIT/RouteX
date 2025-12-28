
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storageService.get<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      storageService.set(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}
