import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { type Theme } from '../utils/theme';
import { StorageService } from '../utils';
import { lightTheme, darkTheme, type ThemeName } from '../utils/theme';

// Theme context type
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  dispatch: React.Dispatch<ThemeAction>;
  toggleTheme: () => void;
  setTheme: (themeName: ThemeName) => void;
}

// Theme actions
type ThemeAction = 
  | { type: 'TOGGLE' }
  | { type: 'SET_THEME'; payload: ThemeName };

// Theme reducer
const themeReducer = (state: Theme, action: ThemeAction): Theme => {
  switch (action.type) {
    case 'TOGGLE': {
      const currentThemeName = state.name === 'light' ? 'dark' : 'light';
      StorageService.setThemeName(currentThemeName);
      return currentThemeName === 'light' ? lightTheme : darkTheme;
    }
    case 'SET_THEME': {
      StorageService.setThemeName(action.payload);
      return action.payload === 'light' ? lightTheme : darkTheme;
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
  const savedThemeName = StorageService.getThemeName();
  const savedTheme = savedThemeName === 'light' ? lightTheme : darkTheme;
  const [theme, dispatch] = useReducer(themeReducer, savedTheme || initialTheme || lightTheme);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE' });
  };

  const setTheme = (themeName: ThemeName) => {
    dispatch({ type: 'SET_THEME', payload: themeName });
  };

  const themeName: ThemeName = theme.name;

  // Apply theme to document elements
  useEffect(() => {
    // Apply transition styles to document elements for consistent timing
    document.documentElement.style.transition = 'background-color 0.2s ease, color 0.2s ease';
    document.body.style.transition = 'background-color 0.2s ease, color 0.2s ease';
    
    // Apply theme colors
    document.documentElement.style.backgroundColor = theme.background.primary;
    document.documentElement.style.color = theme.text.primary;
    document.body.style.backgroundColor = theme.background.primary;
    document.body.style.color = theme.text.primary;
  }, [theme]);

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
