// hooks/usePersistentState.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for state that persists to AsyncStorage on a per-user basis.
 *
 * @param baseKey - The base key for storage (e.g., '@MyApp:Settings')
 * @param userId - The unique ID of the current user, or null/undefined if logged out.
 * @param initialState - The default state value.
 * @returns [state, setState]
 */
export function usePersistentState<T>(
  baseKey: string,
  userId: string | null | undefined,
  initialState: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Create a dynamic key. Use 'guest' for the logged-out state.
  const dynamicKey = `${baseKey}:${userId || 'guest'}`;

  const [state, setState] = useState<T>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // This effect now re-runs whenever the user changes (i.e., dynamicKey changes)
  useEffect(() => {
    let isMounted = true;
    const loadPersistedState = async () => {
      try {
        const stored = await AsyncStorage.getItem(dynamicKey);
        if (isMounted && stored !== null) {
          const parsed = JSON.parse(stored);
          setState(parsed);
        }
      } catch (error) {
        console.warn(`Failed to load state for key "${dynamicKey}":`, error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadPersistedState();

    return () => {
      isMounted = false;
    };
  }, [dynamicKey]); // The dependency array is key. It re-loads state on user change.
  // Persist state changes (but not until we've loaded the initial state for the current user)
  const persistentSetState = useCallback(
    (value: T | ((prev: T) => T)) => {
      // Don't save anything until we've loaded the initial state for the current user
      if (!isLoaded) return;

      setState((prev) => {
        const newState =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

        AsyncStorage.setItem(dynamicKey, JSON.stringify(newState)).catch(
          (error) => {
            console.warn(
              `Failed to persist state for key "${dynamicKey}":`,
              error
            );
          }
        );

        return newState;
      });
    },
    [dynamicKey, isLoaded]
  );

  return [state, persistentSetState];
}
