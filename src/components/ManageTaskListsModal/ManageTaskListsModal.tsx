import Modal from '../Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';
import './ManageTaskListsModal.css';
import '../Modal/ModalShared.css';

interface ManageTaskListsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageTaskListsModal({ isOpen, onClose }: ManageTaskListsModalProps) {
  const { theme } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="manage-task-lists-modal">
        <div className="manage-task-lists-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="manage-task-lists-modal-title" style={{ color: theme.text.primary, margin: 0 }}>
            Manage Task Lists
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
        <p style={{ color: theme.text.secondary }}>
          Here you can add, rename, or remove task lists. (Feature coming soon!)
        </p>
        <div className="manage-task-lists-modal-footer">
          <button className="modal-footer-btn" onClick={onClose} style={{ color: theme.text.primary }}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
