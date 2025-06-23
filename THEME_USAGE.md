# Theme System Documentation

A centralized theming utility for the ReTasker app with light and dark theme support.

## Setup

### 1. Theme Provider

Wrap your app with the ThemeProvider:

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider initialTheme="light">
      <YourComponents />
    </ThemeProvider>
  );
}
```

### 2. Using the Theme Hook

Access theme colors and controls in any component:

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, themeName, toggleTheme, setTheme } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.background.primary,
      color: theme.text.primary 
    }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
}
```

## Available Theme Colors

### Background Colors
- `theme.background.primary` - Main background
- `theme.background.secondary` - Secondary background  
- `theme.background.tertiary` - Tertiary background
- `theme.background.elevated` - Elevated surfaces

### Text Colors
- `theme.text.primary` - Primary text
- `theme.text.secondary` - Secondary text
- `theme.text.tertiary` - Tertiary text
- `theme.text.inverse` - Inverse text

### Border Colors
- `theme.border.light` - Light borders
- `theme.border.medium` - Medium borders
- `theme.border.dark` - Dark borders

### Task Card Colors
- `theme.taskCard.background` - Card background
- `theme.taskCard.border` - Card border
- `theme.taskCard.shadow` - Card shadow
- `theme.taskCard.shadowHover` - Card hover shadow

### Task Board Colors
- `theme.taskBoard.background` - Board background
- `theme.taskBoard.columnBackground` - Column background
- `theme.taskBoard.columnBorder` - Column border

### Interactive Colors
- `theme.interactive.primary` - Primary buttons/links
- `theme.interactive.primaryHover` - Primary hover state
- `theme.interactive.secondary` - Secondary buttons
- `theme.interactive.success` - Success states
- `theme.interactive.warning` - Warning states
- `theme.interactive.danger` - Danger states

### Icon Colors
- `theme.icon.primary` - Primary icons
- `theme.icon.secondary` - Secondary icons
- `theme.icon.interactive` - Interactive icons

### Attribution Colors
- `theme.attribution.background` - Attribution background
- `theme.attribution.border` - Attribution border
- `theme.attribution.shadow` - Attribution shadow

## Theme Context API

### Properties
- `theme: Theme` - Current theme object with all colors
- `themeName: 'light' | 'dark'` - Current theme name
- `dispatch: Function` - Raw dispatch function
- `toggleTheme: () => void` - Toggle between light/dark
- `setTheme: (themeName) => void` - Set specific theme

### Actions
- `{ type: 'TOGGLE' }` - Toggle theme
- `{ type: 'SET_THEME', payload: 'light' | 'dark' }` - Set specific theme

## Usage Examples

### Styled Component
```tsx
const StyledCard = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: theme.background.elevated,
      border: `1px solid ${theme.border.light}`,
      color: theme.text.primary,
      boxShadow: `0 2px 4px ${theme.taskCard.shadow}`
    }}>
      {children}
    </div>
  );
};
```

### Conditional Styling
```tsx
const IconButton = ({ icon: Icon }) => {
  const { theme, themeName } = useTheme();
  
  return (
    <button style={{
      backgroundColor: themeName === 'dark' 
        ? theme.background.secondary 
        : theme.background.primary,
      color: theme.interactive.primary
    }}>
      <Icon color={theme.icon.interactive} />
    </button>
  );
};
```

### Theme Toggle Button
```tsx
const ThemeToggle = () => {
  const { themeName, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {themeName === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

## TypeScript Support

Full TypeScript support with:
- `Theme` type for theme objects
- `ThemeName` type for theme names
- Complete IntelliSense for all color properties
- Type-safe theme switching

## Components Using Theme

✅ **TaskCard** - Background, text, borders, icons
✅ **Attribution** - Background, text, shadows
✅ **ThemeToggle** - Interactive toggle button

## Extending Themes

Add new colors to both light and dark themes in `src/utils/theme.ts`:

```ts
export const lightTheme = {
  // ...existing colors...
  newComponent: {
    background: '#ffffff',
    text: '#000000',
  }
};

export const darkTheme = {
  // ...existing colors...
  newComponent: {
    background: '#1a1a1a', 
    text: '#ffffff',
  }
};
```
