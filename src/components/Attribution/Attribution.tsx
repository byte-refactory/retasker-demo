import { ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './Attribution.css';

export default function Attribution() {
  const { theme } = useTheme();
  
  return (
    <div 
      className="attribution"
      style={{
        backgroundColor: theme.attribution.background,
        borderColor: theme.attribution.border,
        boxShadow: `0 2px 8px ${theme.attribution.shadow}`,
      }}
    >
      <p className="attribution-text" style={{ color: theme.text.secondary }}>
        Icons by{' '}
        <a 
          href="https://lucide.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="attribution-link"
          style={{ color: theme.interactive.primary }}
        >
          Lucide
          <ExternalLink size={14} className="attribution-link-icon" />
        </a>
      </p>
    </div>
  );
}
