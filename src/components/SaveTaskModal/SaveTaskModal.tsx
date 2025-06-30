import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import type { Task } from '../../models';
import './SaveTaskModal.css';
import '../Modal/ModalShared.css';

interface SaveTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskListId: string;
  taskListName: string;
  task?: Task | null; // If provided, we're editing; if not, we're creating
  onDelete?: () => void; // Optional delete handler for edit mode
}

export default function SaveTaskModal({ 
  isOpen, 
  onClose, 
  taskListId, 
  taskListName, 
  task, 
  onDelete 
}: SaveTaskModalProps) {
  const { theme } = useTheme();
  const { createTask, updateTask } = useTaskLists();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const isEditMode = !!task;

  // Update form when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode - populate with existing task data
        setFormData({
          title: task.title,
          description: task.description
        });
      } else {
        // Create mode - reset form
        setFormData({
          title: '',
          description: ''
        });
      }
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (isEditMode && task) {
        // Update existing task
        updateTask(taskListId, task.id, {
          title: formData.title.trim(),
          description: formData.description.trim()
        });
      } else {
        // Create new task
        createTask(taskListId, {
          title: formData.title.trim(),
          description: formData.description.trim()
        });
      }
      handleClose();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
      handleClose();
    }
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    onClose();
  };

  const modalTitle = isEditMode ? 'Edit Task' : `Add Task to ${taskListName}`;
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Task';

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <div className="save-task-modal">
        {/* Header */}
        <div className="save-task-modal-header">
          <h2 className="save-task-modal-title" style={{ color: theme.text.primary }}>
            {modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="modal-x-btn"
            style={{ color: theme.text.secondary }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="save-task-modal-form" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="task-title"
              className="save-task-modal-label"
              style={{ color: theme.text.primary }}
            >
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="save-task-modal-input"
              style={{
                border: `1px solid ${theme.border.medium}`,
                backgroundColor: theme.background.primary,
                color: theme.text.primary,
              }}
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="save-task-modal-label"
              style={{ color: theme.text.primary }}
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description (optional)..."
              rows={3}
              className="save-task-modal-textarea"
              style={{
                border: `1px solid ${theme.border.medium}`,
                backgroundColor: theme.background.primary,
                color: theme.text.primary,
              }}
            />
          </div>

          {/* Footer */}
          <div className="save-task-modal-footer">
            {/* Delete button - only show in edit mode */}
            {isEditMode && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="delete-task-btn"
                title="Delete task"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            
            <div className="footer-buttons">
              <button
                type="button"
                onClick={handleClose}
                className="modal-footer-btn"
                style={{ color: theme.text.secondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="save-task-modal-submit-btn"
                style={{
                  border: `1px solid ${theme.interactive.primary}`,
                  backgroundColor: theme.interactive.primary,
                  color: theme.text.inverse,
                  opacity: formData.title.trim() ? 1 : 0.6,
                }}
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        </form>
      </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
