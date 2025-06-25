import { Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDroppable } from '../../hooks';
import type { Task } from '../../models';
import './TrashDropZone.css';

interface TrashDropZoneProps {
  isVisible: boolean;
  onDrop: (task: Task) => void;
}

export default function TrashDropZone({ isVisible, onDrop }: TrashDropZoneProps) {
  const { theme } = useTheme();

  const { dropRef, isOver } = useDroppable({
    accept: 'task',
    onDrop: (dragItem) => {
      onDrop(dragItem.data as Task);
    },
  });

  if (!isVisible) return null;  return (
    <div 
      ref={dropRef}
      className={`trash-drop-zone ${isOver ? 'trash-drop-zone-over' : ''}`}
      style={{
        backgroundColor: isOver ? '#ff4444' : theme.background.secondary,
        borderColor: isOver ? '#ff6666' : theme.border.medium,
        color: isOver ? '#ffffff' : theme.text.secondary,
      }}
    >
      <Trash2 
        size={24} 
        className={`trash-icon ${isOver ? 'trash-icon-active' : ''}`}
      />
      <span className="trash-text">
        {isOver ? 'Release to Delete' : 'Drop to Delete'}
      </span>
    </div>
  );
}
