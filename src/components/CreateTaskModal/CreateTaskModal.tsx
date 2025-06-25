import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import Modal from '../Modal';
import './CreateTaskModal.css';
import '../Modal/ModalShared.css';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskListId: string;
    taskListName: string;
}

export default function CreateTaskModal({ isOpen, onClose, taskListId, taskListName }: CreateTaskModalProps) {
    const { theme } = useTheme();
    const { createTask } = useTaskLists();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim()) {
            createTask(taskListId, {
                title: formData.title.trim(),
                description: formData.description.trim()
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({ title: '', description: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="medium">
            <div className="create-task-modal">
                {/* Header */}
                <div className="create-task-modal-header">
                    <h2 className="create-task-modal-title" style={{ color: theme.text.primary }}>
                        Add Task to {taskListName}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="modal-x-btn"
                        style={{ color: theme.text.secondary }}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>      {/* Form */}
                <form className="create-task-modal-form" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="task-title"
                            className="create-task-modal-label"
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
                            className="create-task-modal-input"
                            style={{
                                border: `1px solid ${theme.border.medium}`,
                                backgroundColor: theme.background.primary,
                                color: theme.text.primary,
                            }}
                            autoFocus
                        />
                    </div>        <div>
                        <label
                            htmlFor="task-description"
                            className="create-task-modal-label"
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
                            className="create-task-modal-textarea"
                            style={{
                                border: `1px solid ${theme.border.medium}`,
                                backgroundColor: theme.background.primary,
                                color: theme.text.primary,
                            }}
                        />
                    </div>        {/* Footer */}
                    <div className="create-task-modal-footer">
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
                            className="create-task-modal-submit-btn"
                            style={{
                                border: `1px solid ${theme.interactive.primary}`,
                                backgroundColor: theme.interactive.primary,
                                opacity: formData.title.trim() ? 1 : 0.6,
                            }}
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
