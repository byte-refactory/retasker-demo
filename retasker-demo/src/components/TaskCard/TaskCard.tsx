import React from 'react';
import type { Task } from '../../models';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  columnColor?: string; // Optional prop for column color
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnColor }) => {
  return (
    <div className="task-card" style={{borderColor: columnColor || '#000'}}>
      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
    </div>
  );
};

export default TaskCard;
