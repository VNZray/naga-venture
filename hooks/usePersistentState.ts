// hooks/usePersistentState.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for state that persists to AsyncStorage
 *
 * @param key - AsyncStorage key for persistence
 * @param initialState - Initial state value
 * @returns [state, setState] - Similar to useState but with persistence
 */
export function usePersistentState<T>(
  key: string,
  initialState: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          setState(parsed);
        }
      } catch (error) {
        console.warn(`Failed to load persisted state for key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPersistedState();
  }, [key]);

  // Persist state changes (but not on initial load)
  const persistentSetState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newState =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

        // Only persist if we've loaded the initial state
        if (isLoaded) {
          AsyncStorage.setItem(key, JSON.stringify(newState)).catch((error) => {
            console.warn(`Failed to persist state for key "${key}":`, error);
          });
        }

        return newState;
      });
    },
    [key, isLoaded]
  );

  return [state, persistentSetState];
}
