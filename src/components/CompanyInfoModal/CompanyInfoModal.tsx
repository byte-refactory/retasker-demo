import { ExternalLink, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CompanyInfoModalProps {
  onClose: () => void;
}

export default function CompanyInfoModal({ onClose }: CompanyInfoModalProps) {
  const { theme } = useTheme();

  return (
    <div style={{ padding: '24px', minWidth: '400px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: theme.text.primary,
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          About Byte Refactory
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: theme.text.secondary,
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ 
          margin: '0 0 16px 0', 
          color: theme.text.primary,
          lineHeight: 1.6
        }}>
          Byte Refactory is a forward-thinking technology company focused on building 
          innovative software solutions that empower businesses and individuals to 
          achieve their goals more efficiently.
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginTop: '20px'
        }}>
          <span style={{ 
            color: theme.text.primary,
            fontWeight: 500
          }}>
            Visit our website:
          </span>
          <a
            href="https://www.byterefactory.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.interactive.primary,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.background.secondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            www.byterefactory.com
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            border: `1px solid ${theme.interactive.primary}`,
            borderRadius: '4px',
            backgroundColor: theme.interactive.primary,
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
