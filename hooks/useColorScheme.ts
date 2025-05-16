import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Custom hook to normalize color scheme to 'light' | 'dark'
 */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}