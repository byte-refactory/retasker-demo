import { ExternalLink, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Modal from '../Modal';
import './CompanyInfoModal.css';
import '../Modal/ModalShared.css';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyInfoModal({ isOpen, onClose }: CompanyInfoModalProps) {
  const { theme } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="company-info-modal">
        {/* Header */}
        <div className="company-info-modal-header">
          <h2 className="company-info-modal-title" style={{ color: theme.text.primary }}>
            About Byte Refactory
          </h2>
          <button
            className="modal-x-btn"
            onClick={onClose}
            style={{ color: theme.text.secondary }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="company-info-modal-content">
          <p style={{ color: theme.text.primary, lineHeight: 1.6, margin: '0 0 16px 0' }}>
            Byte Refactory is a forward-thinking technology company focused on building
            innovative software solutions that empower businesses and individuals to
            achieve their goals more efficiently.
          </p>
          <div className="company-info-modal-link-row">
            <span style={{ color: theme.text.primary, fontWeight: 500 }}>
              Visit our website:
            </span>
            <a
              className="company-info-modal-link"
              href="https://www.byterefactory.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.interactive.primary }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = theme.background.secondary;
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              www.byterefactory.com
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
