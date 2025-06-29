import { Trash2, GripVertical } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import '../Modal/ModalShared.css';
import './ListEdit.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ListEditItemProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
}

export default function ListEditItem({ id, value, onChange, onDelete, placeholder }: ListEditItemProps) {
  const { theme } = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // Disable transition during drag
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`list-edit-item ${isDragging ? 'list-edit-item-dragging' : ''}`}
    >
      <input
        className="list-edit-item-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: theme.background.secondary,
          color: theme.text.primary,
          border: `1px solid ${theme.border.medium}`,
        }}
      />
      <div
        className="list-edit-item-drag-handle"
        {...attributes}
        {...listeners}
        style={{ color: theme.text.secondary }}
      >
        <GripVertical size={16} />
      </div>

      <button
        className="modal-x-btn"
        type="button"
        aria-label="Delete"
        onClick={onDelete}
        style={{ color: theme.interactive.danger }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
