import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Task } from '../../models';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string; // Optional prop for column color
}

function TaskCard({ task, columnColor }: TaskCardProps) {
  const { theme } = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      className={`task-card ${isDragging ? 'task-card-dragging' : ''}`}
      role="article"
      aria-labelledby={`task-${task.id}-title`}
      aria-describedby={`task-${task.id}-description`}
      data-task-card="true"
      data-task-id={task.id}
      style={{ 
        ...style,
        borderColor: columnColor || theme.taskCard.border,
        backgroundColor: theme.taskCard.background,
        boxShadow: `0 2px 4px ${theme.taskCard.shadow}`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="task-card-content">
        <h4 
          id={`task-${task.id}-title`}
          className="task-title" 
          style={{ color: theme.text.primary }}
        >
          {task.title}
        </h4>
        <p 
          id={`task-${task.id}-description`}
          className="task-description" 
          style={{ color: theme.text.secondary }}
        >
          {task.description}
        </p>
      </div>
      
      {/* Drag Handle */}
      <div 
        className="task-drag-handle"
        {...attributes}
        {...listeners}
        style={{ color: theme.text.secondary }}
        title="Drag to move task"
      >
        <GripVertical size={16} />
      </div>
    </div>
  );
}

export default TaskCard;
