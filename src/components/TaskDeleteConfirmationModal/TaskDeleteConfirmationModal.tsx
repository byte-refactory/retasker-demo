import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Modal from '../Modal';
import type { Task } from '../../models';
import './TaskDeleteConfirmationModal.css';
import '../Modal/ModalShared.css';

interface TaskDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
  taskListName: string;
}

export default function TaskDeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  task,
  taskListName
}: TaskDeleteConfirmationModalProps) {
  const { theme } = useTheme();

  if (!task) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className="task-delete-modal">
        <div className="task-delete-modal-header">
          <div className="task-delete-modal-icon">
            <AlertTriangle size={24} color="#ff4444" />
          </div>
          <h2 className="task-delete-modal-title" style={{ color: theme.text.primary }}>
            Delete Task
          </h2>
        </div>

        <div className="task-delete-modal-content">
          <p style={{ color: theme.text.primary }}>
            Are you sure you want to delete this task?
          </p>
          
          <div className="task-delete-modal-task-info">
            <strong style={{ color: theme.text.primary }}>"{task.title}"</strong>
            <span style={{ color: theme.text.secondary }}>from {taskListName}</span>
          </div>
          
          <p style={{ color: theme.text.secondary, fontSize: '14px' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="task-delete-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="modal-footer-btn"
            style={{ color: theme.text.primary }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="task-delete-modal-confirm-btn"
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
