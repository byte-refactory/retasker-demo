import { X } from 'lucide-react';
import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';
import './ConfirmationModal.css';

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
      <div className="confirmation-modal">
        {/* Header */}
        <div className="confirmation-modal-header">
          <h2 className="confirmation-modal-title" style={{ color: theme.text.primary }}>
            {title}
          </h2>
          <button
            className="confirmation-modal-close-btn"
            onClick={onClose}
            style={{ color: theme.text.secondary }}
          >
            <X size={20} />
          </button>
        </div>
        {/* Content */}
        <div className="confirmation-modal-content" style={{ color: theme.text.primary }}>
          {message}
        </div>
        {/* Footer */}
        <div className="confirmation-modal-footer">
          <button
            className="confirmation-modal-cancel-btn"
            type="button"
            onClick={onClose}
            style={{ color: theme.text.secondary }}
          >
            {cancelText}
          </button>
          <button
            className="confirmation-modal-confirm-btn"
            type="button"
            onClick={handleConfirm}
            style={{ background: getVariantColor(), color: theme.text.inverse }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
