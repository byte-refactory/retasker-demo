import { useTheme } from '../../contexts/ThemeContext';
import type { Task } from '../../models';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string; // Optional prop for column color
}

function TaskCard({ task, columnColor }: TaskCardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="task-card"
      role="article"
      aria-labelledby={`task-${task.id}-title`}
      aria-describedby={`task-${task.id}-description`}
      data-task-card="true"
      data-task-id={task.id}
      style={{ 
        borderColor: columnColor || theme.taskCard.border,
        backgroundColor: theme.taskCard.background,
        boxShadow: `0 2px 4px ${theme.taskCard.shadow}`,
        cursor: 'default',
        userSelect: 'none',
      }}
    >
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
