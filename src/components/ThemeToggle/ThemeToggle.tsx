import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${themeName === 'light' ? 'dark' : 'light'} theme`}
      style={{
        backgroundColor: theme.background.elevated,
        color: theme.text.primary,
        borderColor: theme.border.medium,
      }}
    >
      <div className="theme-icon-container">
        {themeName === 'light' ? (
          <>
            <Sunrise size={16} color={theme.icon.secondary} className="day-night-icon" />
            <Moon size={20} color={theme.icon.primary} className="main-icon" />
          </>
        ) : (
          <>
            <Sunset size={16} color={theme.icon.secondary} className="day-night-icon" />
            <Sun size={20} color={theme.icon.primary} className="main-icon" />
          </>
        )}
      </div>
    </button>
  );
}
