import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import Modal from '../Modal';
import type { Task } from '../../models';
import './SaveEditModal.css';
import '../Modal/ModalShared.css';

interface SaveEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskListId: string;
  taskListName: string;
  task?: Task | null; // If provided, we're editing; if not, we're creating
  onDelete?: () => void; // Optional delete handler for edit mode
}

export default function SaveEditModal({ 
  isOpen, 
  onClose, 
  taskListId, 
  taskListName, 
  task, 
  onDelete 
}: SaveEditModalProps) {
  const { theme } = useTheme();
  const { createTask, updateTask } = useTaskLists();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

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
  }, [isOpen, task?.id, task?.title, task?.description]);

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
    if (onDelete) {
      onDelete();
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    onClose();
  };

  const modalTitle = isEditMode ? 'Edit Task' : `Add Task to ${taskListName}`;
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Task';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <div className="save-edit-modal">
        {/* Header */}
        <div className="save-edit-modal-header">
          <h2 className="save-edit-modal-title" style={{ color: theme.text.primary }}>
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
        <form className="save-edit-modal-form" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="task-title"
              className="save-edit-modal-label"
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
              className="save-edit-modal-input"
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
              className="save-edit-modal-label"
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
              className="save-edit-modal-textarea"
              style={{
                border: `1px solid ${theme.border.medium}`,
                backgroundColor: theme.background.primary,
                color: theme.text.primary,
              }}
            />
          </div>

          {/* Footer */}
          <div className="save-edit-modal-footer">
            {/* Delete button - only show in edit mode */}
            {isEditMode && onDelete && (
              <div className="footer-left">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="delete-task-btn"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
            
            <div className="footer-right">
              <button
                type="button"
                onClick={handleClose}
                className="modal-footer-btn"
                style={{ color: theme.text.primary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="save-edit-modal-submit-btn"
                style={{
                  border: `1px solid ${theme.interactive.primary}`,
                  backgroundColor: theme.interactive.primary,
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
  );
}
