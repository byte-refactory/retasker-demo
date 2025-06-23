import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { type Theme } from '../utils/theme';
import { StorageService } from '../utils';
import { lightTheme, darkTheme } from '../utils/theme';

// Theme context type
interface ThemeContextType {
  theme: Theme;
  themeName: string;
  dispatch: React.Dispatch<ThemeAction>;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Theme actions
type ThemeAction = 
  | { type: 'TOGGLE' }
  | { type: 'SET_THEME'; payload: Theme };

// Theme reducer
const themeReducer = (state: Theme, action: ThemeAction): Theme => {
  switch (action.type) {
    case 'TOGGLE': {
      const currentTheme = state.name === 'Light Theme' ? darkTheme : lightTheme;
      StorageService.setTheme(currentTheme);
      return currentTheme;
    }
    case 'SET_THEME': {
      StorageService.setTheme(action.payload);
      return action.payload;
    }
    default: 
      return state;
  }
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

// Theme provider component
export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // Get initial theme from storage or use provided initial theme
  const savedTheme = StorageService.getTheme();
  const [theme, dispatch] = useReducer(themeReducer, savedTheme || initialTheme || lightTheme);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE' });
  };

  const setTheme = (newTheme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  const themeName = theme.name === 'Light Theme' ? 'light' : 'dark';

  const contextValue: ThemeContextType = {
    theme,
    themeName,
    dispatch,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
