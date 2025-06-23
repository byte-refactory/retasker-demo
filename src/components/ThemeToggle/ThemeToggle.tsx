import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${themeName === 'light' ? 'dark' : 'light'} theme`}
      type="button"
      style={{
        backgroundColor: theme.background.elevated,
        color: theme.text.primary,
        borderColor: theme.border.medium,
      }}
    >
      <div className="theme-icon-container">
        {themeName === 'light' ? (
          <>
            <Sunrise size={16} color={theme.icon.secondary} className="day-night-icon" aria-hidden="true" />
            <Moon size={20} color={theme.icon.primary} className="main-icon" aria-hidden="true" />
          </>
        ) : (
          <>
            <Sunset size={16} color={theme.icon.secondary} className="day-night-icon" aria-hidden="true" />
            <Sun size={20} color={theme.icon.primary} className="main-icon" aria-hidden="true" />
          </>
        )}
      </div>
    </button>
  );
}
