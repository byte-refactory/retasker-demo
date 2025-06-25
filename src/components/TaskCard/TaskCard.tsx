import { ArrowRight, ArrowDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDraggable } from '../../hooks';
import type { Task } from '../../models';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string; // Optional prop for column color
  onDragStart?: (task: Task) => void;
  onDragEnd?: (task: Task) => void;
}

function TaskCard({ task, columnColor, onDragStart, onDragEnd }: TaskCardProps) {
  const { theme } = useTheme();
  
  const { dragRef, isDragging, dragProps } = useDraggable({
    item: {
      id: task.id,
      type: 'task',
      data: task,
    },
    onDragStart: () => onDragStart?.(task),
    onDragEnd: () => onDragEnd?.(task),
  });
  return (
    <div 
      ref={dragRef}
      className={`task-card ${isDragging ? 'task-card-dragging' : ''}`}
      role="article"
      aria-labelledby={`task-${task.id}-title`}
      aria-describedby={`task-${task.id}-description`}
      style={{ 
        borderColor: columnColor || theme.taskCard.border,
        backgroundColor: theme.taskCard.background,
        boxShadow: `0 2px 4px ${theme.taskCard.shadow}`,
        opacity: isDragging ? 0.8 : 1,
        cursor: 'grab',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      }}
      onMouseDown={dragProps.onMouseDown}
    >
      <button 
        className="task-arrow-container"
        aria-label="Move task to next column"
        type="button"
      >
        <ArrowRight 
          className="task-arrow task-arrow-right" 
          size={16} 
          strokeWidth={3}
          color={theme.icon.primary}
          aria-hidden="true"
        />
        <ArrowDown 
          className="task-arrow task-arrow-down" 
          size={16} 
          strokeWidth={3}
          color={theme.icon.primary}
          aria-hidden="true"
        />
      </button>
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
  );
}

export default TaskCard;
