import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Task } from '../../models';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string; // Optional prop for column color
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnColor }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="task-card" 
      style={{ 
        borderColor: columnColor || theme.taskCard.border,
        backgroundColor: theme.taskCard.background,
        boxShadow: `0 2px 4px ${theme.taskCard.shadow}`,
      }}
    >
      <span title="Move Task" className="task-arrow-container">
        <ArrowRight 
          className="task-arrow task-arrow-right" 
          size={16} 
          strokeWidth={3}
          color={theme.icon.primary}
        />
        <ArrowDown 
          className="task-arrow task-arrow-down" 
          size={16} 
          strokeWidth={3}
          color={theme.icon.primary}
        />
      </span>
      <h4 className="task-title" style={{ color: theme.text.primary }}>
        {task.title}
      </h4>
      <p className="task-description" style={{ color: theme.text.secondary }}>
        {task.description}
      </p>
    </div>
  );
};

export default TaskCard;
