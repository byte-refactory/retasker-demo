import { X } from 'lucide-react';
import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info'
}: ConfirmationModalProps) {
  const { theme } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'danger':
        return theme.interactive.danger;
      case 'warning':
        return theme.interactive.warning;
      default:
        return theme.interactive.primary;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
    >
      <div style={{ padding: '24px', minWidth: '350px' }}>
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
            {title}
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
        <p style={{ 
          margin: '0 0 24px 0', 
          lineHeight: 1.5,
          color: theme.text.primary 
        }}>
          {message}
        </p>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.border.medium}`,
              borderRadius: '4px',
              backgroundColor: theme.background.secondary,
              color: theme.text.primary,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 16px',
              border: `1px solid ${getVariantColor()}`,
              borderRadius: '4px',
              backgroundColor: getVariantColor(),
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
